from flask import Flask, request, jsonify
from flask_cors import CORS
from backend3ds import get_current_challenge, evaluate_code, reset_game

app = Flask(__name__)
CORS(app)

@app.route('/get-challenge', methods=['GET'])
def get_challenge():
    challenge = get_current_challenge()
    if challenge:
        return jsonify({'challenge': challenge})
    return jsonify({'message': 'All challenges completed!'}), 200

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    code = data.get('code')
    result = evaluate_code(code)
    return jsonify({'result': result})

@app.route('/reset', methods=['POST'])
def reset():
    reset_game()
    return jsonify({'message': 'Game reset successfully.'})

if __name__ == '__main__':
    app.run(debug=True) 