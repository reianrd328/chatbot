from flask import Flask, redirect, render_template, request, jsonify
from flask_login import LoginManager, login_required, current_user

from config import Config
from models import db, User
from auth import auth
from ai import ask_ai

app = Flask(__name__)
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Login manager
login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.init_app(app)

# Register authentication blueprint
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
        username=current_user.username,
        messages=[]
    )


@app.route("/chat", methods=["POST"])
@login_required
def chat():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "error": "Invalid request."
        }), 400

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "success": False,
            "error": "Message cannot be empty."
        }), 400

    try:

        reply = ask_ai(message)

        # Future:
        # save_message(current_user.id, message, reply)

        return jsonify({

            "success": True,

            "reply": reply,

            "conversation_id": None

        })

    except Exception as e:

        app.logger.exception("Chat Error")

        return jsonify({

            "success": False,

            "error": "Unable to generate response."

        }), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
