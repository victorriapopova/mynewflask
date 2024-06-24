from flask import Flask, render_template, request, jsonify
import random
import string

app = Flask(__name__)


# Models
class Message:
    global_count = 0

    def __init__(self, username, text):
        self.username = username
        self.text = text
        self.id = Message.global_count
        Message.global_count += 1

    def to_dict(self):
        return {
            "username": self.username,
            "text": self.text,
            "id": self.id
        }

    def __repr__(self):
        return str(self.to_dict())


messages = [
    Message("Seller", "Welcome to our headphone shop! How can I help you today?"),
]


# Routes
@app.route("/", methods=["GET", "POST"])
def chat():
    if request.method == "POST":
        username = request.form.get("username", "Customer")
        text = request.form["text"]
        messages.append(Message(username, text))
        return "Msg accepted!"

    return render_template("chat.html")


@app.route("/request_messages", methods=["POST"])
def request_messages():
    last_received_message_id = request.json.get('last_received_message_id', -1)
    new_messages = [m.to_dict() for m in messages if m.id > last_received_message_id]
    return jsonify(new_messages)


if __name__ == "__main__":
    app.run(debug=True, port=5002)
