from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    # Renderiza o seu formulário HTML modificado
    return render_template('index.html')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'manifest.json')

if __name__ == '__main__':
    # Roda o app localmente acessível por computadores e celulares na mesma rede Wi-Fi
    app.run(host='0.0.0.0', port=5000, debug=True)