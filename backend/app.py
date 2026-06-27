from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os
import base64
from database import init_db, save_url_scan, save_ip_scan, get_url_history, get_ip_history

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://threat-pulse-six.vercel.app", "http://localhost:3000"])

init_db()

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")

# ─── HOME ROUTE ───
@app.route('/')
def home():
    return jsonify({"message": "ThreatPulse API is running!"})


# ─── CVE ROUTES ───
@app.route('/api/cves')
def get_cves():
    try:
        severity = request.args.get('severity', None)
        params = {"resultsPerPage": 20}
        if severity:
            params["cvssV3Severity"] = severity.upper()
        
        response = requests.get(
            "https://services.nvd.nist.gov/rest/json/cves/2.0",
            params=params,
            timeout=15
        )
        data = response.json()
        
        cves = []
        for item in data.get("vulnerabilities", []):
            cve = item.get("cve", {})
            metrics = cve.get("metrics", {})
            
            severity_val = "UNKNOWN"
            score = "N/A"
            
            if metrics.get("cvssMetricV31"):
                severity_val = metrics["cvssMetricV31"][0]["cvssData"]["baseSeverity"]
                score = metrics["cvssMetricV31"][0]["cvssData"]["baseScore"]
            elif metrics.get("cvssMetricV30"):
                severity_val = metrics["cvssMetricV30"][0]["cvssData"]["baseSeverity"]
                score = metrics["cvssMetricV30"][0]["cvssData"]["baseScore"]
            elif metrics.get("cvssMetricV2"):
                severity_val = metrics["cvssMetricV2"][0]["baseSeverity"]
                score = metrics["cvssMetricV2"][0]["cvssData"]["baseScore"]
            
            descriptions = cve.get("descriptions", [])
            description = next((d["value"] for d in descriptions if d["lang"] == "en"), "No description available")
            
            cves.append({
                "id": cve.get("id"),
                "description": description[:300],
                "severity": severity_val,
                "score": score,
                "published": cve.get("published", "")[:10]
            })
        
        return jsonify({"success": True, "cves": cves, "total": len(cves)})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── CVE STATS ROUTE ───
@app.route('/api/cves/stats')
def get_cve_stats():
    try:
        stats = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        
        for severity in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
            response = requests.get(
                "https://services.nvd.nist.gov/rest/json/cves/2.0",
                params={"resultsPerPage": 1, "cvssV3Severity": severity},
                timeout=15
            )
            data = response.json()
            stats[severity] = data.get("totalResults", 0)
        
        return jsonify({"success": True, "stats": stats})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── URL SCAN ROUTE ───
@app.route('/api/scan/url', methods=['POST'])
def scan_url():
    try:
        data = request.get_json()
        url_to_scan = data.get("url", "").strip()
        
        if not url_to_scan:
            return jsonify({"success": False, "error": "URL is required"}), 400
        
        headers = {"x-apikey": VIRUSTOTAL_API_KEY}
        
        # Submit URL
        response = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url_to_scan},
            timeout=15
        )
        
        result_data = response.json()
        analysis_id = result_data.get("data", {}).get("id", "")
        
        if not analysis_id:
            return jsonify({"success": False, "error": "Failed to submit URL"}), 500
        
        # Get analysis result
        analysis_response = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers=headers,
            timeout=15
        )
        
        analysis = analysis_response.json()
        stats = analysis.get("data", {}).get("attributes", {}).get("stats", {})
        
        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)
        harmless = stats.get("harmless", 0)
        
        if malicious > 0:
            overall = "Malicious"
        elif suspicious > 0:
            overall = "Suspicious"
        else:
            overall = "Safe"
        
        save_url_scan(url_to_scan, malicious, suspicious, harmless, overall)
        
        return jsonify({
            "success": True,
            "url": url_to_scan,
            "malicious": malicious,
            "suspicious": suspicious,
            "harmless": harmless,
            "overall": overall
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── IP CHECK ROUTE ───
@app.route('/api/check/ip', methods=['POST'])
def check_ip():
    try:
        data = request.get_json()
        ip_address = data.get("ip", "").strip()
        
        if not ip_address:
            return jsonify({"success": False, "error": "IP address is required"}), 400
        
        headers = {"Key": ABUSEIPDB_API_KEY, "Accept": "application/json"}
        params = {"ipAddress": ip_address, "maxAgeInDays": 90, "verbose": True}
        
        response = requests.get(
            "https://api.abuseipdb.com/api/v2/check",
            headers=headers,
            params=params,
            timeout=15
        )
        
        result = response.json().get("data", {})
        
        abuse_score = result.get("abuseConfidenceScore", 0)
        total_reports = result.get("totalReports", 0)
        country = result.get("countryCode", "Unknown")
        isp = result.get("isp", "Unknown")
        domain = result.get("domain", "Unknown")
        
        if abuse_score >= 75:
            risk_level = "High Risk"
        elif abuse_score >= 25:
            risk_level = "Medium Risk"
        else:
            risk_level = "Low Risk"
        
        save_ip_scan(ip_address, abuse_score, total_reports, country, isp)
        
        return jsonify({
            "success": True,
            "ip": ip_address,
            "abuse_score": abuse_score,
            "total_reports": total_reports,
            "country": country,
            "isp": isp,
            "domain": domain,
            "risk_level": risk_level
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ─── HISTORY ROUTES ───
@app.route('/api/history/urls')
def url_history():
    try:
        rows = get_url_history()
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "url": row[1],
                "scan_date": row[2],
                "malicious": row[3],
                "suspicious": row[4],
                "harmless": row[5],
                "overall": row[6]
            })
        return jsonify({"success": True, "history": history})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/history/ips')
def ip_history():
    try:
        rows = get_ip_history()
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "ip": row[1],
                "scan_date": row[2],
                "abuse_score": row[3],
                "total_reports": row[4],
                "country": row[5],
                "isp": row[6]
            })
        return jsonify({"success": True, "history": history})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)