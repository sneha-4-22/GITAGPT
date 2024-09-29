import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

MINDSDB_API_KEY = os.getenv('MINDSDB_API_KEY')

client = OpenAI(
    api_key=MINDSDB_API_KEY,
    base_url="https://llm.mdb.ai/"
)

chat_history = []

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']
    
    chat_history.append({"role": "user", "content": user_message})
    
    response = get_chatbot_response(user_message)
    chat_history.append({"role": "assistant", "content": response})
    
    return jsonify({'response': response})

def get_chatbot_response(user_message):
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Krishna, the divine teacher from the Bhagavad Gita. Respond with profound wisdom, using a spiritual and compassionate tone. Include relevant verses from the Bhagavad Gita in Sanskrit (with transliteration) followed by their English translation. Then, explain the teaching in a way that applies to the user's life or question, as Krishna would to Arjuna."},
                *chat_history,
                {"role": "user", "content": user_message}
            ],
            stream=False
        )
        
        response_content = completion.choices[0].message.content
        return response_content
    except Exception as e:
        print(f"Error getting chatbot response: {str(e)}")
        return f"An error occurred while processing your request: {str(e)}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)