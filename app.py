import os
from flask import Flask, render_template, redirect, jsonify, request
import pandas as pd
import lib

app = Flask(__name__)
app.debug = True


@app.route('/')
def root():
    return redirect("/index"), 302


@app.route('/index', methods=['POST', 'GET'])
def index():
    if request.method == 'POST' and request.files:
        f = request.files['fileupload']
        df = pd.read_csv(f.stream)
        return render_template('index.html',
                               name=dict({'nodeKeyProperty': 'id', 'nodeDataArray': lib.getNodeDataArray(df),
                                          'linkDataArray': lib.getLinkDataArray(df)}))
    return render_template('index.html', name=dict({'nodeKeyProperty': 'id', 'nodeDataArray': [], 'linkDataArray': []}))


@app.route('/get_data')
def get_data():
    df = pd.read_csv('data.csv')
    return jsonify({'data': {'nodeKeyProperty': 'id', 'nodeDataArray': lib.getNodeDataArray(df),
                             'linkDataArray': lib.getLinkDataArray(df)}})


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error-404.html', data=str(e)), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('error-404.html', data=str(e)), 405


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
