from flask import Flask, render_template, request, jsonify
import database
import json

app = Flask(__name__)

@app.route("/")
def homepage():
    # page = request.args.get("page", type=int, default=1)
    # per_page = 20  # Number of items to display per page
    # start = (page - 1) * per_page
    # end = start + per_page
    # paginated_classes = all_classes[start:end]
    all_classes = database.select_all_classes()
    teacherName_to_legacyID = { name: legacyID for name, legacyID in database.select_teacherName_and_legacyID() }
    return render_template("index.html", all_classes=all_classes, teacherName_to_legacyID=teacherName_to_legacyID)

@app.route("/teacher/<name>")
def show_teacher_page(name):
    # show all the general data that would be on the teacher's rmp page
    # e.g. avgRating, difficultyLevel, wouldTakeAgainPercent, etc
    teacher_data = database.select_teacher_data(name) # (teacher_id, teacher_name, department, rmp_legacyID, rating, difficulty_level, wouldTakeAgainPercent)
    all_reviews = database.select_reviews_data(name)
    return render_template("teacher.html", all_reviews=json.dumps(all_reviews), teacher_data=teacher_data)

if __name__ == "__main__":
    app.run(debug=True)
