import os
from flask import Flask, render_template, redirect, jsonify, request
import csv
import io

app = Flask(__name__)
app.debug = True

outputFile = 'static/file/output.csv'

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

@app.route('/data', methods=['GET'])
def getData():
    with open(outputFile, 'r') as csvfile:
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


def load_topic_subtopic_data():
    with open('topics_subtopics_principles.csv', 'r') as csvfile:
        data = list(csv.reader(csvfile, delimiter=','))
        return data

def update_topic_subtopic_data(data):
    with open(outputFile, 'a+') as file:
        itercars = iter(data)
        next(itercars)
        for row in itercars:
            writer = csv.writer(file)
            writer.writerow([row[0],row[1],'topic ---> subtopic'])
            writer.writerow([row[1],row[2],'subtopic ---> principal'])
    file.close()


def write_into_file(data):
    with open(outputFile, 'w+') as file:
        if not os.stat(outputFile).st_size == 0:
             file.truncate(0)
        writer = csv.writer(file)
        writer.writerow(["source", "target", "value"])
        for idx, column in enumerate(data):
            for x in range(len(column)):
                if not (data[0][x]=="null" or  data[idx][x]=="null" or column[0]=="null"):
                    row = [column[0] , data[0][x] , data[idx][x]]
                    writer = csv.writer(file)
                    writer.writerow(row)
    file.close()
    topic_subtopic_data = load_topic_subtopic_data()
    update_topic_subtopic_data(topic_subtopic_data)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error-404.html', data=str(e)), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('error-404.html', data=str(e)), 405


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
