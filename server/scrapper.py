
from __future__ import annotations
from datetime import datetime
import re
from typing import Any, Dict, List
import requests
from bs4 import BeautifulSoup
import json
import os


websites = [
    {   
        'theatreName': 'Kino Aero',
        'url' : 'https://www.kinoaero.cz/en'
    },
    {   
        'theatreName': 'Ponerepo Cinema',
        'url' : 'https://nfa.cz/en/ponrepo-cinema'
    },
    { 
        'theatreName': 'Kino Lucerna',
        'url' : 'https://www.kinolucerna.cz/en'
    },
    { 
        'theatreName': 'Kino Svetozor',
        'url' : 'https://www.kinosvetozor.cz/en'
    },
    { 
        'theatreName': 'Kino 35',
        'url' : 'https://kino35.ifp.cz/'
    },
    {
        'theatreName': 'Kino Atlas',
        'url' : 'https://www.kinoatlaspraha.cz/'
    }
]

def _normalise_date(raw_date: str) -> str:
    """Return dates in DD-MM-YYYY format when parsing is possible."""
    if not raw_date:
        return raw_date

    match = re.search(r"(\d{1,2})[.\-\s](\d{1,2})[.\-\s](\d{2,4})", raw_date)
    if not match:
        return raw_date.strip()

    day, month, year = match.groups()
    if len(year) == 2:
        year = f"20{year}"

    try:
        parsed = datetime.strptime(f"{day}-{month}-{year}", "%d-%m-%Y")
    except ValueError:
        return raw_date.strip()

    return parsed.strftime("%d-%m-%Y")


def _format_time(raw_time: str) -> str:
    """Convert 24-hour HH:MM strings to 'H:MM am/pm' when possible."""
    if not raw_time:
        return raw_time

    raw_time = raw_time.strip()
    match = re.match(r"^(\d{1,2})[:.](\d{2})$", raw_time)
    if not match:
        return raw_time

    hours, minutes = map(int, match.groups())
    if hours == 0:
        return f"12:{minutes:02d} am"
    if hours == 12:
        return f"12:{minutes:02d} pm"
    if hours > 12:
        return f"{hours - 12}:{minutes:02d} pm"
    return f"{hours}:{minutes:02d} am"

OMDb_KEY = os.environ.get('OMDb')

def get_movie_details(title) :
    API_URL = f'http://www.omdbapi.com/?apikey={OMDb_KEY}&t={title}'
    # use param s for searching with all possible titles
    fields = ['rating', 'awards', 'plot', 'poster']
    movie_info = dict.fromkeys(fields)
    if title:
        res = requests.get(API_URL)
        if res.status_code == 200 :
            res_json = res.json()
            movie_info['name'] = title
            movie_info['rating'] = res_json.get('imdbRating', 'NA')
            movie_info['awards'] = res_json.get('Awards', '')
            movie_info['plot'] = res_json.get('Plot', 'NA')
            movie_info['poster'] = res_json.get('Poster')
        else : 
            movie_info['errors'] = res.text
    
    return movie_info

def gather_data_from_url(url: str) -> List[Dict[str, Any]]:
    """Fetch programme information from ``url`` and return structured data."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
        "Cookie" : "lang=en"
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.RequestException as exc:  # pragma: no cover - network issues
        raise RuntimeError(f"Unable to fetch data from {url}: {exc}") from exc

    soup = BeautifulSoup(response.text, "html.parser")

    schedule: List[Dict[str, Any]] = []
    program_root = soup.select_one("#program .program") or soup.select_one(".program")
    if not program_root:
        return schedule

    for program_root in soup.select("#program .program") :
        day_anchors = program_root.select("a.program__day")
        for day_anchor in day_anchors:
            day_id = day_anchor.get("id", "")
            raw_date = day_id.replace("program-day-", "") if day_id else day_anchor.get_text(strip=True)
            date_str = _normalise_date(raw_date)

            shows: List[Dict[str, str]] = []
            info_block = day_anchor.find_next_sibling("div", class_="program__info")
            if info_block:
                for row in info_block.select(".program__info-row"):
                    time_node = row.select_one(".program__hour") or row.find("time")
                    raw_time = time_node.get_text(strip=True) if time_node else ""

                    title_node = row.select_one(".program__movie-name") or row.select_one("[data-page-title]")
                    title = title_node.get_text(strip=True) if title_node else ""

                    if title or raw_time:
                        movie_info = get_movie_details(title)
                        shows.append({
                            "name": title,
                            "time": _format_time(raw_time),
                            "rating": movie_info['rating'],
                            "plot" : movie_info['plot'],
                            "awards" : movie_info['awards'],
                            "poster": movie_info['poster'],
                            "errors" : movie_info.get('errors')
                        })
                        

            schedule.append({
                "date": date_str,
                "movies": shows,
            })

    return schedule

def get_theatres_data() : 
    final_data = []
    for website in websites:
        #if website["name"] == 'Kino Aero' :
        cinema_data = {}
        cinema_data['theatreName'] = website['theatreName']
        shows = []
        try :
            shows = gather_data_from_url(website['url'])
        except Exception as e: 
            shows = []
        cinema_data['shows'] = shows
        final_data.append(cinema_data)
    return final_data

if __name__ == '__main__' : 
    final_data = []
    for website in websites:
        if website["theatreName"] == 'Kino Aero' :
            cinema_data = {}
            cinema_data['theatreName'] = website['theatreName']
            shows = gather_data_from_url(website['url'])
            cinema_data['shows'] = shows
            final_data.append(cinema_data)
    print(json.dumps(final_data))    
