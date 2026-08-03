from flask import Flask, redirect, render_template, request, jsonify
from flask_login import LoginManager, login_required, current_user

from config import Config
from models import db, User, Chat, Message
from auth import auth
from ai import ask_ai

app = Flask(__name__)
app.config.from_object(Config)
print("=" * 50)
print("DATABASE:", Config.DB_NAME)
print("HOST:", Config.DB_HOST)
print("PORT:", Config.DB_PORT)
print("=" * 50)

# ==========================
# Database
# ==========================

db.init_app(app)

with app.app_context():
    db.create_all()

# ==========================
# Login Manager
# ==========================

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.init_app(app)

# ==========================
# Blueprints
# ==========================

app.register_blueprint(auth)

# ==========================
# User Loader
# ==========================

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ==========================
# Home
# ==========================

@app.route("/")
def home():
    return redirect("/login")

# ==========================
# Dashboard
# ==========================

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template(
        "dashboard.html",
        username=current_user.username,
        messages=[]
    )

# ==========================
# Send Chat Message
# ==========================

@app.route("/chat", methods=["POST"])
@login_required
def chat():

    data = request.get_json()

    message = data.get("message", "")
    chat_id = data.get("chat_id")

    try:

        # Create a new chat if this is the first message
        if not chat_id:

            chat = Chat(
                user_id=current_user.id,
                title="New Chat"
            )

            db.session.add(chat)
            db.session.commit()

        else:

            chat = Chat.query.filter_by(
                id=chat_id,
                user_id=current_user.id
            ).first()

            if not chat:

                return jsonify({
                    "success": False,
                    "error": "Chat not found"
                }), 404

                # Save user message
        db.session.add(
            Message(
                chat_id=chat.id,
                role="user",
                content=message
            )
        )

        # Automatically rename a new chat
        if chat.title == "New Chat":
            title = message.strip()

            if len(title) > 40:
                title = title[:40] + "..."

            chat.title = title

        # Ask AI
        reply = ask_ai(message)

        # Save AI reply
        db.session.add(
            Message(
                chat_id=chat.id,
                role="assistant",
                content=reply
            )
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "chat_id": chat.id,
            "reply": reply
        })

    except Exception as e:

        db.session.rollback()

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==========================
# Create New Chat
# ==========================

@app.route("/chat/new", methods=["POST"])
@login_required
def new_chat():

    chat = Chat(
        user_id=current_user.id,
        title="New Chat"
    )

    db.session.add(chat)
    db.session.commit()

    return jsonify({
        "success": True,
        "chat_id": chat.id
    })

# ==========================
# Get All Chats
# ==========================

@app.route("/chats", methods=["GET"])
@login_required
def get_chats():

    chats = Chat.query.filter_by(
        user_id=current_user.id
    ).order_by(
        Chat.updated_at.desc()
    ).all()

    return jsonify([
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at.strftime("%Y-%m-%d %H:%M")
            if chat.created_at else ""
        }
        for chat in chats
    ])

# ==========================
# Get One Chat
# ==========================

@app.route("/chat/<int:chat_id>", methods=["GET"])
@login_required
def get_chat(chat_id):

    chat = Chat.query.filter_by(
        id=chat_id,
        user_id=current_user.id
    ).first()

    if not chat:
        return jsonify({
            "success": False,
            "error": "Chat not found"
        }), 404

    return jsonify({
        "success": True,
        "chat_id": chat.id,
        "title": chat.title,
        "messages": [
            {
                "role": message.role,
                "content": message.content
            }
            for message in chat.messages
        ]
    })

# ==========================
# Run App
# ==========================

if __name__ == "__main__":
    app.run(debug=True)
