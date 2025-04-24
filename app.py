from flask import Flask, render_template, request, jsonify, send_from_directory, url_for, session
import os
import io
import sys
import uuid
import json
import base64
import traceback
import shutil
import tempfile
import subprocess
from pathlib import Path
from contextlib import redirect_stdout, redirect_stderr
from datetime import datetime
import textwrap

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret')

COURSE_FILES_DIR = 'course_files'
os.makedirs(COURSE_FILES_DIR, exist_ok=True)
os.makedirs(os.path.join('static', 'images'), exist_ok=True)
os.makedirs(os.path.join('static', 'css'), exist_ok=True)
os.makedirs(os.path.join('static', 'js'), exist_ok=True)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/')
def index():
    if 'temp_dir' not in session:
        temp_dir = tempfile.mkdtemp(prefix='student_session_')
        session['temp_dir'] = temp_dir
        os.makedirs(os.path.join(temp_dir, 'images'), exist_ok=True)
    return render_template('index.html')

@app.route('/api/session_cleanup', methods=['POST'])
def session_cleanup():
    if 'temp_dir' in session:
        try:
            shutil.rmtree(session['temp_dir'], ignore_errors=True)
            session.pop('temp_dir', None)
            return jsonify({'status': 'success'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)})
    return jsonify({'status': 'success', 'message': 'No session to clean'})

@app.route('/session_images/<path:filename>')
def serve_session_image(filename):
    if 'temp_dir' not in session:
        return jsonify({'status': 'error', 'message': 'No active session'}), 404
    return send_from_directory(os.path.join(session['temp_dir'], 'images'), filename)

@app.route('/api/course_files', methods=['GET'])
def list_course_files():
    try:
        files = []
        for file in os.listdir(COURSE_FILES_DIR):
            if file.endswith('.py'):
                with open(os.path.join(COURSE_FILES_DIR, file), 'r') as f:
                    files.append({'filename': file, 'content': f.read()})
        return jsonify({'status': 'success', 'files': files})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'temp_dir' not in session:
        return jsonify({'status': 'error', 'message': 'No active session'}), 400

    file = request.files.get('file')
    if not file or file.filename == '':
        return jsonify({'status': 'error', 'message': 'No file provided'}), 400

    try:
        file_path = os.path.join(session['temp_dir'], file.filename)
        file.save(file_path)
        with open(file_path, 'r') as f:
            return jsonify({'status': 'success', 'filename': file.filename, 'content': f.read()})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/run', methods=['POST'])
def run_code():
    if 'temp_dir' not in session:
        return jsonify({'status': 'error', 'message': 'No active session'}), 400

    code = request.json.get('code', '')
    images_dir = os.path.join(session['temp_dir'], 'images')

    indented_code = textwrap.indent(code, '    ')

    runtime_template = f"""
import sys
import io
import traceback
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import uuid
import os
import base64
from io import BytesIO
from contextlib import redirect_stdout, redirect_stderr
import json

os.environ['DISPLAY'] = ':99'
IMAGES_DIR = {repr(images_dir)}
os.makedirs(IMAGES_DIR, exist_ok=True)
generated_images = []

original_savefig = plt.savefig
def patched_savefig(filename=None, *args, **kwargs):
    if not filename:
        filename = f"{{uuid.uuid4()}}.png"
    filename = os.path.join(IMAGES_DIR, os.path.basename(filename))
    img_data = BytesIO()
    original_savefig(img_data, format='png', *args, **kwargs)
    img_data.seek(0)
    img_base64 = base64.b64encode(img_data.read()).decode('utf-8')
    img_data.seek(0)
    with open(filename, 'wb') as f:
        f.write(img_data.read())
    generated_images.append({{
        'filename': os.path.basename(filename),
        'filepath': filename,
        'data_url': f"data:image/png;base64,{{img_base64}}"
    }})
    return filename

plt.savefig = patched_savefig

original_show = plt.show
def patched_show(*args, **kwargs):
    filename = f"{{uuid.uuid4()}}.png"
    filepath = os.path.join(IMAGES_DIR, filename)
    plt.savefig(filepath)
    return original_show(*args, **kwargs)

plt.show = patched_show

execution_result = {{'output': '', 'error': '', 'images': []}}
stdout = io.StringIO()
stderr = io.StringIO()
from contextlib import redirect_stdout, redirect_stderr

try:
{indented_code}
except Exception:
    execution_result['error'] = traceback.format_exc()

execution_result['output'] = stdout.getvalue()
execution_result['images'] = generated_images
print("__EXECUTION_RESULT__")
print(json.dumps(execution_result))
"""

    temp_filename = f"temp_{{uuid.uuid4()}}.py"
    temp_filepath = os.path.join(session['temp_dir'], temp_filename)

    with open(temp_filepath, 'w') as f:
        f.write(runtime_template)

    try:
        result = subprocess.run([sys.executable, temp_filepath], capture_output=True, text=True, timeout=30)
        os.remove(temp_filepath)

        stdout = result.stdout
        stderr = result.stderr

        if "__EXECUTION_RESULT__" in stdout:
            try:
                json_start = stdout.find("__EXECUTION_RESULT__") + len("__EXECUTION_RESULT__")
                execution_result = json.loads(stdout[json_start:].strip())
                execution_result['output'] = stdout[:stdout.find("__EXECUTION_RESULT__")].strip()
            except json.JSONDecodeError:
                execution_result = {'output': stdout, 'error': 'Failed to parse execution result', 'images': []}
        else:
            execution_result = {'output': stdout, 'error': stderr, 'images': []}

        return jsonify({
            'status': 'success',
            'output': execution_result.get('output', ''),
            'error': execution_result.get('error', ''),
            'images': execution_result.get('images', [])
        })

    except subprocess.TimeoutExpired:
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        return jsonify({'status': 'error', 'error': 'Execution timed out (limit: 30 seconds)', 'images': []})

    except Exception as e:
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        return jsonify({'status': 'error', 'error': str(e), 'images': []})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)

