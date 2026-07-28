from flask import Flask, redirect, render_template
from flask_login import LoginManager, login_required, current_user
from ai import ask_ai
from flask import request, jsonify
from config import Config
from models import db, User
from auth import auth
from flask_migrate import Migrate

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Initialize Login Manager
login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.init_app(app)

# Register Blueprints
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


# Create database tables when the application starts
with app.app_context():
    try:
        db.create_all()
        print("✅ Database connected successfully.")
    except Exception as e:
        print("❌ Database Error:", e)

@app.route("/chat", methods=["POST"])
@login_required
def chat():

    data = request.get_json()

    message = data.get("message", "")

    reply = ask_ai(message)

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
