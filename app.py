import csv
import io
import os

from flask import Flask, jsonify, redirect, render_template, request

app = Flask(__name__)
app.debug = True

experts_data = 'static/file/experts.csv'
students_data = 'static/file/students.csv'


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


@app.route('/')
def root():
    return redirect("/index"), 302


@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html', data='')


@app.route('/students-data', methods=['GET'])
def get_students_data():
    with open(students_data, 'r') as csvfile:
        data = list(csv.reader(csvfile, delimiter=','))
        return jsonify(data)


@app.route('/experts-data', methods=['GET'])
def get_experts_data():
    with open(experts_data, 'r') as csvfile:
        data = list(csv.reader(csvfile, delimiter=','))
        return jsonify(data)


@app.route('/index', methods=['POST'])
def update_csv():
    f = request.files and request.files['data_file']
    if not f:
        return render_template('index.html', data='Plese choose a file')
    stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    data = list(csv.reader(stream))
    write_into_file(data)
    return render_template('index.html', data='New data updated')


@app.route('/students', methods=['POST'])
def update_students_csv():
    f = request.files and request.files['students_data_file']
    if not f:
        return render_template('index.html', data='Plese choose a file')
    stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    data = list(csv.reader(stream))
    write_students_data_into_file(data)
    return redirect("/index"), 302
    # return render_template('index.html', data='New data updated')


def load_topic_subtopic_data():
    with open('topics_subtopics_principles.csv', 'r') as csvfile:
        data = list(csv.reader(csvfile, delimiter=','))
        return data


def update_topic_subtopic_data(data):
    with open(experts_data, 'a+') as file:
        itercars = iter(data)
        next(itercars)
        for row in itercars:
            writer = csv.writer(file)
            if row[0] and row[1]:
                writer.writerow([row[0], row[1], 99999])
            if row[1] and row[2]:
                writer.writerow([row[1], row[2], 999999])
    file.close()


def write_into_file(data):
    with open(experts_data, 'w+') as file:
        if not os.stat(experts_data).st_size == 0:
            file.truncate(0)
        writer = csv.writer(file)
        writer.writerow(["source", "target", "value"])
        for idx, column in enumerate(data):
            for x in range(len(column)):
                if not (data[0][x] == "null" or data[idx][x] == "null" or column[0] == "null" or data[0][x] == "" or
                        data[idx][x] == "" or column[0] == ""):
                    row = [column[0], data[0][x], data[idx][x]]
                    writer = csv.writer(file)
                    writer.writerow(row)
    file.close()
    # topic_subtopic_data = load_topic_subtopic_data()
    # update_topic_subtopic_data(topic_subtopic_data)


def write_students_data_into_file(data):
    with open(students_data, 'w+') as file:
        if not os.stat(students_data).st_size == 0:
            file.truncate(0)
        writer = csv.writer(file)
        writer.writerow(["source", "target", "value"])
        for idx, column in enumerate(data):
            for x in range(len(column)):
                if not (data[0][x] == "null" or data[idx][x] == "null" or column[0] == "null" or data[0][x] == "" or
                        data[idx][x] == "" or column[0] == ""):
                    row = [column[0], data[0][x], data[idx][x]]
                    writer = csv.writer(file)
                    writer.writerow(row)
    file.close()


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error-404.html', data=str(e)), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('error-404.html', data=str(e)), 405


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
