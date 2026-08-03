from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
import uuid
from datetime import datetime, timedelta, timezone
from models import db, User

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            flash("Username already exists.")
            return redirect(url_for("auth.register"))

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            flash("Email already exists.")
            return redirect(url_for("auth.register"))

        # Create new user
        user = User(
            username=username,
            email=email
        )

        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        flash("Registration successful! Please log in.")
        return redirect(url_for("auth.login"))

    return render_template("register.html")


@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):

            # Session timeout (30 minutes)
            if (
                user.session_id and
                user.last_activity and
                datetime.now(timezone.utc) - user.last_activity < timedelta(minutes=30)
            ):

                flash(
                    "This account is already logged in on another device.",
                    "danger"
                )
                return redirect(url_for("auth.login"))

            # Generate a new session
            user.session_id = str(uuid.uuid4())
            user.last_activity = datetime.now(timezone.utc)

            db.session.commit()

            login_user(user)

            return redirect(url_for("dashboard"))

        flash("Invalid email or password.")

    return render_template("login.html")
