import socket
import platform
import subprocess
from datetime import datetime

target = input("Enter target domain or IP: ")

print("\nStarting reconnaissance...\n")

print("Time:", datetime.now())

print("\nSystem Information")
print("OS:", platform.system())
print("Version:", platform.release())

try:
    ip = socket.gethostbyname(target)
    print("\nResolved IP:", ip)
except:
    print("Could not resolve domain")
    exit()

print("\nRunning Ping Test\n")

ping = subprocess.getoutput("ping -c 1 " + target)
print(ping)

print("\nScanning Common Ports\n")

ports = [21,22,80,443]

for port in ports:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)

    if s.connect_ex((ip, port)) == 0:
        print("Port", port, "OPEN")

    s.close()

print("\nRecon scan complete.")

