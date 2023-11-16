import sqlite3

conn = sqlite3.connect("db.db", check_same_thread=False)

# Decorator function to skip duplicates entries
def unique_skip(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" not in str(e):
                raise e
    return wrapper

def init_db():
    """Creates all the tables in the db
    PARAMS:
        cur: sqlite3 cursor object
    RETURNS:
        sqlite3 connection object
    """
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS teachers(
            teacher_id TEXT PRIMARY KEY UNIQUE,
            name TEXT,
            department TEXT,
            legacy_id INTEGER,
            rating REAL,
            difficulty_level REAL,
            would_take_again INTEGER
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews(
            review_id TEXT PRIMARY KEY UNIQUE,
            teacher_id TEXT REFERENCES teachers(teacher_id) ON DELETE CASCADE,
            class_name TEXT,
            comment TEXT,
            date DATE,  
            clarity_rating REAL,
            difficulty_rating REAL,
            grade TEXT,
            helpful_rating REAL,
            isOnlineClass BOOLEAN CHECK (isOnlineClass IN (0, 1)),
            rating_tags TEXT
        )
    """)

    # maybe make a table for every semester
    # how to make it update automatically on new semester?
    cur.execute("""
        CREATE TABLE IF NOT EXISTS classes(
            section TEXT PRIMARY KEY,
            class_number INTEGER,
            mode_instruction TEXT,
            course_title TEXT,
            units INTEGER,
            type TEXT,
            days TEXT,
            times TEXT,
            instructor TEXT,
            instructor_rating TEXT DEFAULT "N/A",
            location TEXT,
            dates TEXT,
            open_seats INTEGER
        )
    """)
    cur.close()

@unique_skip
def insert_class_into_db(section, class_number, mode_instruction, course_title, units, class_type, days, times, instructor, location, dates, open_seats):
    cur = conn.cursor()
    cur.execute("INSERT INTO classes (section, class_number, mode_instruction, course_title, units, type, days, times, instructor, location, dates, open_seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (section, class_number, mode_instruction, course_title, units, class_type, days, times, instructor, location, dates, open_seats))
    conn.commit()
    cur.close()

@unique_skip
def insert_teacher_into_db(id, name, department, legacyID, rating, difficulty_level, wouldTakeAgainPercent):
    cur = conn.cursor()
    cur.execute("INSERT INTO teachers (teacher_id, name, department, legacy_id, rating, difficulty_level, would_take_again) VALUES (?, ?, ?, ?, ?, ?, ?)", (id, name, department, legacyID, rating, difficulty_level, wouldTakeAgainPercent))
    conn.commit()
    cur.close()

@unique_skip
def insert_review_into_db(review_id, teacher_id, class_name, comment, date, clarity_rating, difficulty_rating, grade, helpful_rating, isOnlineClass, rating_tags):
    cur = conn.cursor()
    cur.execute("INSERT INTO reviews (review_id, teacher_id, class_name, comment, date, clarity_rating, difficulty_rating, grade, helpful_rating, isOnlineClass, rating_tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (review_id, teacher_id, class_name, comment, date, clarity_rating, difficulty_rating, grade, helpful_rating, isOnlineClass, rating_tags))
    conn.commit()
    cur.close()

def update_instructor_rating_in_classes_table(instructor, rating):
    cur = conn.cursor()
    cur.execute("UPDATE classes SET instructor_rating = ? WHERE instructor = ?", (rating, instructor))
    conn.commit()
    cur.close()

def select_teacher_data(name):
    cur = conn.cursor()
    cur.execute("SELECT * FROM teachers WHERE name = ?", (name,))
    res = cur.fetchall()
    cur.close()
    return res

def select_teacherName_and_legacyID():
    cur = conn.cursor()
    cur.execute("SELECT name, legacy_id FROM teachers");
    res = cur.fetchall()
    cur.close()
    return res

def select_all_classes():
    cur = conn.cursor()
    cur.execute("SELECT * FROM classes")
    res = cur.fetchall()
    cur.close()
    return res

def select_all_instructorNames():
    cur = conn.cursor()
    cur.execute("SELECT instructor FROM classes")
    res = cur.fetchall()
    cur.close()
    return res

def select_reviews_data(teacher_name):
    cur = conn.cursor()
    cur.execute("""
            SELECT r.class_name, r.date, r.clarity_rating, r.difficulty_rating, r.grade, r.helpful_rating, r.isOnlineClass 
            FROM reviews AS r 
            INNER JOIN teachers as t
            ON t.teacher_id = r.teacher_id
            WHERE t.name = ?""", (teacher_name,))
    res = cur.fetchall()
    cur.close()
    return res
