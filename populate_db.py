# this file will be the code that calls the scrapers and puts the data we scrape into the db
import requests
import bs4
import asyncio
import aiohttp

import database
from fetch_data import (
        get_allTeacherInfo_and_allTeacherReviews,
        get_classes_semester_data
)

# maybe add some way to automatically make it update so that it doesn't have to be hardcoded
# URL = "https://www.sjsu.edu/classes/schedules/fall-2023.php"
URL = "https://www.sjsu.edu/classes/schedules/spring-2024.php"

def scrape_classData_into_db(url):
    for classData in get_classes_semester_data(url):
        database.insert_class_into_db(*classData)

def scrape_teacher_into_db(all_teacher_info):
    for teacherInfo in all_teacher_info:
        database.insert_teacher_into_db(*teacherInfo)
        # update instructor_rating column in `classes` table
        # MIGHT CHANGE THIS LATER. DOES NOT CURRENTLY WORK CORRECTLY IF INSTRUCTORS HAVE SAME NAME
        if teacherInfo[4] != 0:
            database.update_instructor_rating_in_classes_table(teacherInfo[1], teacherInfo[4]) # (teacherName, avgRating)

def scrape_reviews_data_into_db(all_teacher_reviews):
    for teacher_reviews in all_teacher_reviews:
        database.insert_review_into_db(*teacher_reviews)


# FOR TESTING
conn = database.init_db()
print("Scraping class data into db...")
scrape_classData_into_db(URL)
cur = conn.cursor()
cur.execute("SELECT instructor FROM classes")
teacher_names = sorted(set(list((map(lambda x: x[0], cur.fetchall())))))
cur.close()
print("fetching data from rmp...")
all_teacher_info, all_teacher_reviews = asyncio.run(get_allTeacherInfo_and_allTeacherReviews(teacher_names))
print("Scraping teacher info into db...")
scrape_teacher_into_db(all_teacher_info)
print("Scraping teacher reviews into db...")
scrape_reviews_data_into_db(all_teacher_reviews)

