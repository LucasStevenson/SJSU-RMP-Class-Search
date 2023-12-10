from flask import Flask, render_template, request, jsonify
import database

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/teacher/<name>")
def show_teacher_page(name):
    teacher_data = database.select_teacher_data(name) # (teacher_id, teacher_name, department, rmp_legacyID, rating, difficulty_level, wouldTakeAgainPercent)
    return render_template("teacher.html", teacher_data=teacher_data)

@app.route("/api/data/all_classes")
def get_all_classes():
    all_classes = database.select_all_classes()
    return jsonify(all_classes)

@app.route("/api/data/all_reviews/<name>")
def get_all_reviews(name):
    all_reviews = database.select_reviews_data(name)
    return jsonify(all_reviews)

@app.route("/api/data/teacherName_to_legacyID")
def map_teacherName_to_legacyID():
    teacherName_to_legacyID = { name: legacyID for name, legacyID in database.select_teacherName_and_legacyID() }
    return jsonify(teacherName_to_legacyID)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
