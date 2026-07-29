from flask import Flask, redirect, render_template, request, jsonify
from flask_login import LoginManager, login_required, current_user

from config import Config
from models import db, User
from auth import auth
from ai import get_ai_response   # <-- import AI function

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.init_app(app)

app.register_blueprint(auth)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
def home():
    return redirect("/login")


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template(
        "dashboard.html",
        username=current_user.username
    )


# -----------------------------
# AI CHAT ROUTE
# -----------------------------
@app.route("/chat", methods=["POST"])
@login_required
def chat():

    data = request.get_json()

    if not data:
        return jsonify({"reply": "No data received."}), 400

    message = data.get("message", "")

    if message == "":
        return jsonify({"reply": "Message cannot be empty."}), 400

    try:
        reply = get_ai_response(message)

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        print(e)

        return jsonify({
            "reply": "Error connecting to AI."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
