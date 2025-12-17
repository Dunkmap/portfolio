from flask import Flask, render_template, request, redirect, send_from_directory, url_for
import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage

load_dotenv()

app = Flask(__name__)

# ---------------- SMTP CONFIG ----------------
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
CONTACT_TO = os.getenv("CONTACT_TO", "divyarajvt752@gmail.com")

# ---------------- EXPERIENCE ----------------
EXPERIENCE = [
    {
        "company": "TRACIDA",
        "role": "Data Analyst Intern",
        "duration": "May 2024 – Aug 2024",
        "location": "Remote",
        "description": (
            "Automated reports and interactive dashboards to support data-driven decision-making. "
            "Cleaned and structured large datasets using Excel and SQL. "
            "Collaborated with cross-functional teams to analyze KPIs and deliver client-ready insights."
        ),
        "skills": [
            "Power BI",
            "Excel",
            "SQL",
            "Data Cleaning",
            "Dashboard Development",
            "KPI Analysis"
        ]
    }
]

# ---------------- PROJECTS ----------------
PROJECTS = [
    {
        "title": "Insurance Claims Analysis",
        "img": "img/projects/insurance-3d.jpg",
        "tags": "Power BI • Fraud Detection",
        "desc": [
            "Built an interactive Power BI dashboard for insurance claims.",
            "Implemented DAX measures, slicers, and filters.",
            "Performed claim segmentation and fraud detection.",
            "Improved claims visibility and risk assessment.",
            "Delivered actionable business insights."
        ],
        "link": "https://www.linkedin.com/posts/divya-raj-91136726b_powerbi-dashboarddesign-dataanalytics-activity-7377438138840891393-PRso/"
    },
    {
        "title": "Sales Intelligence Dashboard",
        "img": "img/projects/sales-dashboard-3d.png",
        "tags": "Power BI • ETL • Business Intelligence",
        "desc": [
            "Designed end-to-end ETL pipelines using Power Query.",
            "Built data models and KPI dashboards.",
            "Analyzed sales trends and performance metrics.",
            "Used drill-down charts and slicers.",
            "Created executive-ready reports."
        ],
        "link": "#"
    },
    {
        "title": "Red Wine Quality Analysis",
        "img": "img/projects/wine-analysis.jpg",
        "tags": "Python • EDA • Data Visualization",
        "desc": [
            "Performed data cleaning and exploratory analysis.",
            "Visualized correlations using Seaborn and Matplotlib.",
            "Identified key chemical factors affecting quality.",
            "Used Pandas for structured analysis.",
            "Generated insight-driven plots."
        ],
        "link": "https://github.com/Dunkmap/Data-Analyst-practice/blob/main/RED_WINE_DATA.ipynb"
    },
    {
        "title": "Credit Card Fraud Detection",
        "img": "img/projects/fraud-detection.jpg",
        "tags": "Machine Learning • Fraud Analytics",
        "desc": [
            "Developed fraud detection model using synthetic data.",
            "Focused on feature engineering.",
            "Handled class imbalance techniques.",
            "Evaluated model performance metrics.",
            "Applied analytics for risk detection."
        ],
        "link": "https://github.com/Dunkmap/Fraud-detection-Using-M.L.git"
    },
    {
        "title": "Customer Segmentation Analysis",
        "img": "img/projects/customer-segmentation.jpg",
        "tags": "Python • Clustering • Machine Learning",
        "desc": [
            "Performed customer segmentation using K-means clustering.",
            "Analyzed purchasing patterns and customer behavior.",
            "Created targeted marketing strategies based on segments.",
            "Visualized clusters with interactive plots.", 
            "Improved customer retention insights."
        ],
        "link": "#"
    }
]

# ---------------- ROUTES ----------------
@app.route("/")
def index():
    return render_template(
        "index.html",
        projects=PROJECTS,
        experience=EXPERIENCE
    )

@app.route("/resume")
def resume():
    return send_from_directory(
        ".", 
        "Divya Data Analyst Resume.pdf"
    )

@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    if not (name and email and message):
        return redirect(url_for("index") + "#contact")

    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        try:
            msg = EmailMessage()
            msg["Subject"] = f"Portfolio Contact: {name}"
            msg["From"] = SMTP_USER
            msg["To"] = CONTACT_TO
            msg.set_content(
                f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
            )

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)

        except Exception as e:
            print("Email error:", e)

    return redirect(url_for("index") + "#contact")

# ---------------- MAIN ----------------
if __name__ == "__main__":
    app.run(debug=True)
