from flask import Flask, render_template, send_from_directory
import os

# Força o Flask a reconhecer a pasta static de forma absoluta
app = Flask(__name__, static_folder='static', static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sw.js')
def service_worker():
    return send_from_directory(os.path.abspath(os.path.dirname(__file__)), 'sw.js', mimetype='application/javascript')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static'), 'manifest.json', mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)