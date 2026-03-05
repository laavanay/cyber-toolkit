from flask import Flask, render_template, request
from recon import run_scan

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():

    scan_result = None

    if request.method == "POST":
        target = request.form.get("target")
        scan_result = run_scan(target)

    return render_template("index.html", result=scan_result)

if __name__ == "__main__":
    app.run(debug=True)