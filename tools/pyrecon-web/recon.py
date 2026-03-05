import socket
import platform
from datetime import datetime

def run_scan(target):

    result = {}
    result["target"] = target
    result["time"] = str(datetime.now())

    result["system"] = {
        "os": platform.system(),
        "version": platform.release()
    }

    try:
        ip = socket.gethostbyname(target)
        result["ip"] = ip
    except:
        result["ip"] = "Unable to resolve"

    ports = [21,22,80,443]
    open_ports = []

    if result["ip"] != "Unable to resolve":
        for port in ports:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)

            if s.connect_ex((result["ip"], port)) == 0:
                open_ports.append(port)

            s.close()

    result["ports"] = open_ports

    return result