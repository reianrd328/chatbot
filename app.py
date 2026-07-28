from flask import Flask, render_template, request, redirect, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from ai import ask_ai
import os

app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY", "secret")

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -------------------------
# Database Models
# -------------------------

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    sender = db.Column(db.String(20))
    content = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


# -------------------------
# Create Tables
# -------------------------

with app.app_context():
    db.create_all()


# -------------------------
# Home
# -------------------------

@app.route("/")
def home():
    return redirect("/login")


# -------------------------
# Register
# -------------------------

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        existing = User.query.filter_by(username=username).first()

        if existing:
            return "Username already exists."

        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )

        db.session.add(new_user)
        db.session.commit()

        return redirect("/login")

    return render_template("register.html")


# -------------------------
# Login
# -------------------------

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password_hash, password):

            session["user_id"] = user.id
            session["username"] = user.username

            return redirect("/dashboard")

        return "Invalid username/password"

    return render_template("login.html")


# -------------------------
# Dashboard
# -------------------------

@app.route("/dashboard")
def dashboard():

    if "user_id" not in session:
        return redirect("/login")

    messages = Message.query.filter_by(
        user_id=session["user_id"]
    ).order_by(Message.created_at.asc()).all()

    return render_template(
        "dashboard.html",
        username=session["username"],
        messages=messages
    )


# -------------------------
# Chat API
# -------------------------

@app.route("/chat", methods=["POST"])
def chat():

    if "user_id" not in session:
        return jsonify({"reply": "Login required."})

    data = request.get_json()

    user_message = data.get("message", "")

    # Save user message
    user_chat = Message(
        user_id=session["user_id"],
        sender="user",
        content=user_message
    )

    db.session.add(user_chat)
    db.session.commit()

    try:

        ai_reply = ask_ai(user_message)

    except Exception as e:

        ai_reply = f"Error: {str(e)}"

    # Save AI reply
    ai_chat = Message(
        user_id=session["user_id"],
        sender="assistant",
        content=ai_reply
    )

    db.session.add(ai_chat)
    db.session.commit()

    return jsonify({
        "reply": ai_reply
    })


# -------------------------
# Logout
# -------------------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/login")


# -------------------------
# Run
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)
