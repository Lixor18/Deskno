from flask import Flask, render_template, send_from_directory
import os
import time
from threading import Thread

app = Flask(__name__)

# Зберігаємо час останньої модифікації файлів
last_modified_times = {
    'index.html': 0,
    'style.css': 0,
    'script.js': 0
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

def check_for_changes():
    global last_modified_times
    while True:
        time.sleep(1)  # Перевіряємо кожну секунду
        for file in last_modified_times.keys():
            file_path = os.path.join('static', file)
            if os.path.exists(file_path):
                modified_time = os.path.getmtime(file_path)
                if modified_time != last_modified_times[file]:
                    last_modified_times[file] = modified_time
                    print(f"{file} has been modified.")
                    # Тут можна реалізувати логіку для оновлення сторінки
                    # Наприклад, через WebSocket або інший механізм

if __name__ == '__main__':
    # Запускаємо потік для перевірки змін
    Thread(target=check_for_changes, daemon=True).start()
    # Запускаємо сервер на всіх інтерфейсах
    app.run(host='0.0.0.0', port=5000, debug=True)