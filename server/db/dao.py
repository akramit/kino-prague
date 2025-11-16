from .DBcm import UseDatabase
from datetime import datetime

db_config = {
    'db_path' : 'db/theatres.db'
}
TABLE = 'Programs'

def insert_data(date, data):
    _sql = """INSERT INTO Programs (date, data, updatedAt) VALUES(?, ?, ?)"""
    curr_time = datetime.today().strftime('%Y-%m-%d_%H-%M-%S')
    values = (date, data, curr_time)
    with UseDatabase(db_config) as cursor:
        cursor.execute(_sql, values)
        print("data succesfully inserted to ", TABLE)

def update_data(date, data):
    _sql = """UPDATE Programs SET data = ?, updatedAt= ? WHERE date = ?"""
    curr_time = datetime.today().strftime('%Y-%m-%d_%H-%M-%S')
    values = (data, curr_time, date)
    with UseDatabase(db_config) as cursor:
        cursor.execute(_sql, values)
        print("Data updated for date ", date)

def fetch_all_data():
    _sql = """Select * from Programs"""
    output = None
    with UseDatabase(db_config) as cursor:
        cursor.execute(_sql)
        output = cursor.fetchall()
    return output 

def fetch_data_for_date(date):
    _sql = """SELECT * FROM Programs WHERE date = ?"""
    values = (date,)
    output = None
    with UseDatabase(db_config) as cursor:
        cursor.execute(_sql,values)
        output = cursor.fetchall()
    return output

def fetch_latest_data():
    output = fetch_all_data()
    if len(output):
        return output[-1]
    return None


# if __name__ == "__main__":
#     # To run inside directory, change relative import
#     insert_data('2025-15-17', "Testing data")
#     output = fetch_all_data()
#     output_date = fetch_data_for_date('2025-15-17')
#     print("all output")
#     for data in output:
#         print(data)
