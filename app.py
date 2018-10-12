import os
from flask import Flask, render_template, redirect, jsonify, request
import csv
import io

app = Flask(__name__)
app.debug = True

outputFile = 'static/file/output.csv'

@app.route('/')
def root():
    return redirect("/index"), 302


@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/index', methods=['POST'])
def update_csv():
    f = request.files['data_file']
    if not f:
        return
    stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
    data = list(csv.reader(stream))
    print(data)
    write_into_file(data)
    return render_template('index.html', data=data)



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

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error-404.html', data=str(e)), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('error-404.html', data=str(e)), 405


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
