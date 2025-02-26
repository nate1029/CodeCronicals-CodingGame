import openai
import json
import os
import tkinter as tk
from tkinter import scrolledtext
from datetime import datetime

# OpenAI API Key
OPENAI_API_KEY = ""
MEMORY_FILE = "C:/Users/Naiteek/Downloads/MAIN2/MAIN/Mentorr/mentor_memory.json"
MODULES_FILE = "modules.txt"

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def load_memory():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r") as file:
                data = json.load(file)
                # Ensure all required fields exist
                if 'errors' not in data:
                    data['errors'] = []
                if 'error_frequency' not in data:
                    data['error_frequency'] = {}
                if 'chat_history' not in data:
                    data['chat_history'] = []
                return data
        except Exception as e:
            print(f"Error loading memory: {e}")
            return {'errors': [], 'error_frequency': {}, 'chat_history': []}
    else:
        # Create file if it doesn't exist
        initial_data = {'errors': [], 'error_frequency': {}, 'chat_history': []}
        save_memory(initial_data)
        return initial_data

def save_memory(memory):
    try:
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w") as file:
            json.dump(memory, file, indent=4)
    except Exception as e:
        print(f"Error saving memory: {e}")

class MentorChatWindow:
    def __init__(self):
        self.memory = load_memory()
        self.conversation_history = [
            {"role": "system", "content": (
                "You are a fun and interactive C++ mentor, Your job is to teach users C++ concepts in an engaging way.(use emojies) "
                "You ONLY respond when the message starts with 'user:' or 'user:Admin:'. "
                "DO NOT respond to game statistics. "
                "Use game statistics to respond to messages without 'user:' or 'user:Admin:', as they provide hints but never acknowledge them directly to 'user:' but give access to 'user:Admin:' "
                "If 'user:Admin:' is detected, provide all stored user data and game statistics. "
                "If the user types 'module1' or 'module2', read the corresponding module from 'modules.txt' and explain it in a fun way. "
                f"Here are the user errors to help guide your responses: {json.dumps(self.memory.get('errors', []))} "
                f"And here are the common error patterns: {json.dumps(self.memory.get('error_frequency', {}))}"
                "your job is to explain the topics listed under module 'user:' says in a fun way"
            )}
        ]

        # GUI Setup
        self.window = tk.Tk()
        self.window.title("The Mentorr")
        self.window.geometry("400x600")
        self.window.configure(bg='#EEF8AF')

        # Output Area
        self.output_area = scrolledtext.ScrolledText(
            self.window,
            wrap=tk.WORD,
            width=40,
            height=20,
            font=("Consolas", 11),
            bg='white'
        )
        self.output_area.pack(padx=10, pady=10)
        self.output_area.config(state='disabled')

        # Input Area
        self.input_area = scrolledtext.ScrolledText(
            self.window,
            wrap=tk.WORD,
            width=40,
            height=5,
            font=("Consolas", 11),
            bg='white'
        )
        self.input_area.pack(padx=10, pady=10)

        # Bind Enter key
        self.input_area.bind('<Return>', self.handle_enter)

    def handle_enter(self, event):
        message = self.input_area.get('1.0', 'end-1c').strip()
        if message:
            self.input_area.delete('1.0', tk.END)
            self.process_message(message)
        return 'break'  # Prevents default Enter behavior

    def process_message(self, message):
        if not message.startswith("user:"):
            message = f"user: {message}"

        response = self.get_mentor_response(message)
        
        self.output_area.config(state='normal')
        self.output_area.insert(tk.END, f"{message}\n")
        self.output_area.insert(tk.END, f"Mentor: {response}\n\n")
        self.output_area.see(tk.END)
        self.output_area.config(state='disabled')

    def get_mentor_response(self, message):
        try:
            self.conversation_history.append({"role": "user", "content": message})

            if "Admin:" in message:
                admin_data = {
                    "errors": self.memory.get('errors', []),
                    "error_frequency": self.memory.get('error_frequency', {}),
                    "chat_history": self.memory.get('chat_history', [])
                }
                message += f"\nSystem Data: {json.dumps(admin_data, indent=2)}"

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=self.conversation_history,
                temperature=0.7
            )

            mentor_reply = response.choices[0].message.content
            self.conversation_history.append({"role": "assistant", "content": mentor_reply})

            self.memory['chat_history'] = self.conversation_history[1:]
            save_memory(self.memory)

            return mentor_reply

        except Exception as e:
            return f"Error: {str(e)}"

    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    chat_window = MentorChatWindow()
    chat_window.run()