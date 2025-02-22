import subprocess
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

challenges = [
    {
        'desc': "1. Print 'Hello World!'",
        'expected': "Hello World!"
    },
    {
        'desc': "2. Sum of 1+2+3+...+10",
        'expected': "55"
    },
    {
        'desc': "3. Print even numbers 0-8 (space-separated)",
        'expected': "0 2 4 6 8"
    },
    {
        'desc': "4. Calculate factorial of 5",
        'expected': "120"
    },
    {
        'desc': "5. Print Fibonacci sequence up to 5 terms",
        'expected': "0 1 1 2 3"
    }
]

current_level = 0
temp_cpp = "battle_code.cpp"
temp_exe = "battle_program.exe" if os.name == 'nt' else "battle_program"

@app.route('/get-challenge', methods=['GET'])
def get_challenge():
    global current_level
    if current_level < len(challenges):
        return jsonify({'challenge': challenges[current_level]['desc']})
    return jsonify({'message': 'All challenges completed!'}), 200

@app.route('/evaluate', methods=['POST'])
def evaluate_code():
    global current_level
    data = request.json
    code = data.get('code')
    
    if not code:
        return jsonify({'result': "Error: No code to execute!"})

    # Write code to temporary file
    with open(temp_cpp, 'w') as f:
        f.write(code)

    # Compile and execute
    compile_result = subprocess.run(
        ['g++', temp_cpp, '-o', temp_exe],
        stderr=subprocess.PIPE,
        text=True
    )

    if compile_result.returncode != 0:
        return jsonify({'result': f"Compilation Failed: {compile_result.stderr}"})

    try:
        result = subprocess.run(
            [f'./{temp_exe}'] if os.name != 'nt' else [temp_exe],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5
        )
        output = result.stdout.strip()
        error = result.stderr.strip()
    except subprocess.TimeoutExpired:
        return jsonify({'result': "Timeout: Execution took too long!"})

    if error:
        return jsonify({'result': f"Runtime Error: {error}"})

    expected = challenges[current_level]['expected']
    if output == expected:
        current_level += 1
        return jsonify({'result': "Success! Proceed to the next challenge."})
    else:
        return jsonify({'result': "Wrong Output: Try again."})

@app.route('/reset', methods=['POST'])
def reset_game():
    global current_level
    current_level = 0
    return jsonify({'message': 'Game reset successfully.'})

@app.route('/store_error', methods=['POST'])
def store_error():
    try:
        error_data = request.json.get('error')
        task_number = request.json.get('task_number', 0)
        
        # Use absolute path for mentor_memory.json
        memory_file_path = r"C:\Users\Naiteek\Downloads\MAIN2\MAIN\Mentorr\mentor_memory.json"
        
        # Load existing errors
        try:
            with open(memory_file_path, 'r') as f:
                memory = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            memory = {'errors': [], 'error_frequency': {}}

        # Initialize sections if they don't exist
        if 'errors' not in memory:
            memory['errors'] = []
        if 'error_frequency' not in memory:
            memory['error_frequency'] = {}

        # Add new error with timestamp and task number
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        memory['errors'].append({
            'timestamp': timestamp,
            'task_number': task_number,
            'error': error_data
        })

        # Track error frequency
        error_key = f"Task {task_number}: {error_data}"
        memory['error_frequency'][error_key] = memory['error_frequency'].get(error_key, 0) + 1

        # Save back to file with proper indentation
        with open(memory_file_path, 'w') as f:
            json.dump(memory, f, indent=4)

        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)