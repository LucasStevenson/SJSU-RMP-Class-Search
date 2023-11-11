from flask import Flask, render_template, request, jsonify
import database

app = Flask(__name__)

@app.route("/")
def homepage():
    # page = request.args.get("page", type=int, default=1)
    # per_page = 20  # Number of items to display per page
    # start = (page - 1) * per_page
    # end = start + per_page
    # paginated_classes = all_classes[start:end]
    all_classes = database.select_all_classes()
    return render_template("index.html", all_classes=all_classes)

@app.route("/teacher/<name>/<class_section>")
def show_teacher_page(name, class_section):
    # show all the general data that would be on the teacher's rmp page
    # e.g. avgRating, difficultyLevel, wouldTakeAgainPercent, etc
    class_code = "".join(class_section.split()[0:2])
    teacher_data = database.select_teacher_data(name) # (teacher_id, teacher_name, department, rmp_legacyID, rating, difficulty_level, wouldTakeAgainPercent)
    return render_template("teacher.html", class_code=class_code, teacher_data=teacher_data)

@app.route("/api/data/teacherName_to_legacyID")
def get_teacherName_to_rmpLegacyID():
    return jsonify({ name: legacyID for legacyID, name in database.select_legacyID_and_teacherName() })

if __name__ == "__main__":
    app.run(debug=True)
