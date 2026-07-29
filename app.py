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

    data = request.get_json()

    if not data:
        return jsonify({
            "reply": "No message received."
        }), 400

    message = data.get("message", "").strip()

    if message == "":
        return jsonify({
            "reply": "Please enter a message."
        }), 400

    try:

        reply = ask_ai(message)

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "reply": str(e)
        }), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
