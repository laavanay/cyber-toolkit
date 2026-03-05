import socket
import platform
import subprocess
from datetime import datetime

target = input("Enter target domain or IP: ")

report = open("recon_report.txt","w")

report.write("=== Recon Report ===\n")
report.write("Target: " + target + "\n")
report.write("Time: " + str(datetime.now()) + "\n\n")

# System info
report.write("System Information\n")
report.write("OS: " + platform.system() + "\n")
report.write("Version: " + platform.release() + "\n\n")

# DNS lookup
ip = socket.gethostbyname(target)
report.write("Resolved IP: " + ip + "\n\n")

# Ping test
ping = subprocess.getoutput("ping -c 1 " + target)
report.write(ping + "\n\n")

# Port scan
ports = [21,22,80,443]

for port in ports:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    
    result = s.connect_ex((ip, port))
    
    if result == 0:
        report.write(f"Port {port} OPEN\n")
    else:
        report.write(f"Port {port} CLOSED\n")
    
    s.close()

report.close()

print("Recon report saved as recon_report.txt")
