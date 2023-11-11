# this file will be the code that scrapes and cleans all the data fetched from sjsu website and rmp
import requests
import bs4
import asyncio
import aiohttp

from rmp_helper_funcs import get_teacher_info, get_teacher_reviews, _get_teacherRating_with_beautifulSoup

def get_classes_semester_data(url):
    """Gets all the classes from SJSU webpage
    PARAMS:
        url (str)
    RETURNS:
        List of lists. Each list is pretty much a row on the table of classes 
    """
    r = requests.get(url)
    bs = bs4.BeautifulSoup(r.content, "html.parser")
    class_schedule = bs.find(id="classSchedule")
    thead = class_schedule.find("thead")
    headers = [th.get_text() for th in thead.find_all("th", recursive=True)]
    tbody = class_schedule.find("tbody")
    class_data = []
    for tr in tbody.find_all("tr"):
        data = []
        for td in tr.find_all("td"):
            data.append(td.get_text())
        section, class_number, mode_instruction, course_title, _, units, class_type, days, times, instructor, location, dates, open_seats, _ = data
        class_data.append([section, class_number, mode_instruction, course_title, units, class_type, days, times, instructor.split("/")[0].strip(), location, dates, open_seats])
    return class_data

async def get_allTeacherInfo_and_allTeacherReviews(teacher_names):
    """
    PARAMS:
        teacher_names (list): list of teacher names e.g. ["Bob Smith", "John Doe", ...]
    RETURNS:
        Tuple. 
        (
            [[ teacher_id, firstName, lastName, department, legacyId, avgRating, avgDifficulty, wouldTakeAgainPercent ], ...],
            [[ review_id, teacher_id, class, comment, date, clarityRating, difficultyRating, grade, helpfulRating, isForOnlineClass, ratingTags ], ...]
        )
    """
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(limit_per_host=40)) as session:
        # get teacher general info
        tasks = []
        for teacher_name in teacher_names:
            tasks.append(asyncio.ensure_future(get_teacher_info(teacher_name, session)))
        all_teacher_info_unparsed = await asyncio.gather(*tasks)
        # get teacher reviews
        tasks = []
        for teacher_info_arr in all_teacher_info_unparsed:
            # teacher_info_arr is an array of objects, where each obj contains data for a specific teacher
            # most the time, this array is of length 1
            # if two teachers have the same name, this array will have more than 1 element
            for teacher_obj in teacher_info_arr:
                cursor, teacher = teacher_obj["cursor"], teacher_obj["node"]
                teacher_id = teacher["id"]
                tasks.append(asyncio.ensure_future(get_teacher_reviews(teacher_id, cursor, session)))
        all_teacher_reviews_unparsed = await asyncio.gather(*tasks)

    all_teacher_info = _parse_teacher_info(all_teacher_info_unparsed)
    all_teacher_reviews = _parse_teacher_reviews(all_teacher_reviews_unparsed)
    return (all_teacher_info, all_teacher_reviews)

def _parse_teacher_info(all_teacher_info):
    """Helper function that cleans the array of messy json objects (each the result of calling `get_teacher_info()` function) 
    PARAMS:
        all_teacher_info (list): 
    RETURNS:
        2d list. each list holds the info for a particular teacher
        [id, firstName, lastname, department, legacyId, avgRating, avgDifficulty, wouldTakeAgainPercent]
    """
    cleaned_teacher_info = []
    for teacher_info_arr in all_teacher_info:
        for teacher in teacher_info_arr:
            teacher = teacher["node"]
            cleaned_teacher_info.append([teacher["id"], f"{teacher['firstName']} {teacher['lastName']}", teacher["department"], teacher["legacyId"], teacher["avgRating"], teacher["avgDifficulty"], teacher["wouldTakeAgainPercent"]])
    return cleaned_teacher_info

def _parse_teacher_reviews(all_teacher_reviews):
    """Helper function that cleans the array of messy json objects (each the result of calling `get_teacher_reviews()` function) 
    PARAMS:
        all_teacher_reviews (list): 
    RETURNS:
        2d list. each list holds all the reviews for a particular teacher
        []
    """
    cleaned_teacher_reviews = []
    for reviews_json in all_teacher_reviews:
        teacher_id = reviews_json["data"]["node"]["id"]
        reviews = reviews_json["data"]["node"]["ratings"]["edges"]
        for review_obj in reviews:
            review = review_obj["node"]
            cleaned_teacher_reviews.append([review["id"], teacher_id, review["class"], review["comment"], review["date"], review["clarityRating"], review["difficultyRating"], review["grade"], review["helpfulRating"], review["isForOnlineClass"], review["ratingTags"]])
    return cleaned_teacher_reviews
