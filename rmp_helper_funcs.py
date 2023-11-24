import requests
import bs4
from pprint import pprint

from rmp_graphql_queries import (
        teacherInfo_query,
        reviews_query
)

import asyncio
import aiohttp

headers = {
        "Authorization": "Basic dGVzdDp0ZXN0",
        "Content-Type": "application/json",
        "Host": "www.ratemyprofessors.com",
}

async def get_teacher_info(teacher, session):
    """Get basic info (rating, wouldTakeAgainPercent, avgDifficulty, etc) on a specific teacher from ratemyprofessor
    PARAMS:
        teacher (str):              name of the teacher
        session (aiohttp object):
    RETURNS:
        Array of object(s), where each obj is the teacher data
    """
    teacher_payload = { "query": teacherInfo_query, "variables": { "text": f"{teacher}", "schoolID": "U2Nob29sLTg4MQ==" }}

    async with session.post("https://ratemyprofessors.com/graphql", headers=headers, json=teacher_payload) as r:
        # get the teacher information
        teacher_info = await r.json(content_type=None)
        data = teacher_info["data"]["newSearch"]["teachers"]["edges"]
        if len(data) == 0:
            return data
        # check to see if the teacher name on the sjsu website is the same as on rmp
        if teacher != f"{data[0]['node']['firstName']} {data[0]['node']['lastName']}":
            # if the names are not the same, then we need to modify the json data so that the names match
            teacher_name_splitted = teacher.split()
            firstName, lastName = teacher_name_splitted[0], " ".join(teacher_name_splitted[1:])
            data[0]['node']["firstName"], data[0]['node']["lastName"] = firstName, lastName
        # since the api sometimes returns incorrect data, scrape the rating manually
        legacyId = data[0]["node"]["legacyId"]
        rating = await _get_teacherRating_with_beautifulSoup(legacyId, session) # scrape the data with beautifulsoup
        if rating != None: # if rating is none, that means there was some kind of error when trying to scrape the data 
            data[0]["node"]["avgRating"] = rating
        return data

async def _get_teacherRating_with_beautifulSoup(legacyId, session):
    try:
        async with session.get(f"https://ratemyprofessors.com/professor/{legacyId}") as response:
            content = await response.text()
            bs = bs4.BeautifulSoup(content, "html.parser")
            rating = bs.find('div', class_='RatingValue__Numerator-qw8sqy-2').text
            return rating
    except Exception as e:
        print("ERROR", e)
        print(legacyId)

async def get_teacher_reviews(id, cursor, session):
    """Gets the teacher reviews as json data
    PARAMS:
        id (string):
        cursor (string):
        session (aiohttp object):
    RETURNS:
        json data
    """
    reviews_payload = {"query": reviews_query,"variables":{"count":1000,"id":id,"courseFilter":None,"cursor": cursor}}

    async with session.post("https://ratemyprofessors.com/graphql", headers=headers, json=reviews_payload) as r:
        reviews_info = await r.json()
        return reviews_info

# for testing
async def main(TEACHER):
    async with aiohttp.ClientSession() as session:
        res = await get_teacher_info(TEACHER, session)
        pprint(res)
        # pprint(get_teacher_reviews("VGVhY2hlci0yODIyNjEz", "YXJyYXljb25uZWN0aW9uOjA="))
        # print(res)
        # print()
        # res2 = await get_teacher_reviews(res[0]["node"]["id"], res[0]["cursor"], session)
        # print(res2)


if __name__ == "__main__":
    TEACHER = input("Enter name of teacher: ")
    asyncio.run(main(TEACHER))

