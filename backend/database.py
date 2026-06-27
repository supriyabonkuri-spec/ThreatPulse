import sqlite3

def init_db():
    conn = sqlite3.connect("threatpulse.db")
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS url_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            malicious_count INTEGER,
            suspicious_count INTEGER,
            harmless_count INTEGER,
            overall_result TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ip_scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT,
            scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            abuse_score INTEGER,
            total_reports INTEGER,
            country TEXT,
            isp TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def save_url_scan(url, malicious, suspicious, harmless, result):
    conn = sqlite3.connect("threatpulse.db")
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO url_scans (url, malicious_count, suspicious_count, harmless_count, overall_result)
        VALUES (?, ?, ?, ?, ?)
    ''', (url, malicious, suspicious, harmless, result))
    conn.commit()
    conn.close()

def save_ip_scan(ip, abuse_score, total_reports, country, isp):
    conn = sqlite3.connect("threatpulse.db")
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO ip_scans (ip_address, abuse_score, total_reports, country, isp)
        VALUES (?, ?, ?, ?, ?)
    ''', (ip, abuse_score, total_reports, country, isp))
    conn.commit()
    conn.close()

def get_url_history():
    conn = sqlite3.connect("threatpulse.db")
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM url_scans ORDER BY scan_date DESC LIMIT 20')
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_ip_history():
    conn = sqlite3.connect("threatpulse.db")
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM ip_scans ORDER BY scan_date DESC LIMIT 20')
    rows = cursor.fetchall()
    conn.close()
    return rows