from flask import Flask, render_template, redirect

app = Flask(__name__)


@app.route('/index')
def index():
    return render_template('index.html', name='index page')


@app.route('/')
def root():
    return redirect("/index"), 302


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error-404.html', data=str(e)), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('error-404.html', data=str(e)), 405


if __name__ == '__main__':
    app.run(debug=True)
