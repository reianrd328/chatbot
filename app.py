from flask import Flask
from flask_login import LoginManager
from config import Config
from models import db, User
from auth import auth
from flask import render_template
from flask_login import login_required, current_user

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = "login"
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


if __name__ == "__main__":
    app.run(debug=True)
