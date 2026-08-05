from flask import Flask, redirect, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_login import (
    LoginManager,
    login_required,
    current_user
)

from config import Config
from models import db, User, Chat, Message
from auth import auth
from ai import ask_ai

# ==========================================
# Flask
# ==========================================

app = Flask(__name__)
print("=" * 60)
print("🚀 BUILD VERSION: v2.1 Upload Fix")
print("=" * 60)
app.config.from_object(Config)

# ==========================================
# Database
# ==========================================

db.init_app(app)

with app.app_context():
    db.create_all()

# ==========================================
# Login Manager
# ==========================================

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ==========================================
# Blueprints
# ==========================================

app.register_blueprint(auth)

# ==========================================
# Home
# ==========================================

@app.route("/")
def home():
    return redirect("/login")


# ==========================================
# Dashboard
# ==========================================

@app.route("/dashboard")
@login_required
def dashboard():

    return render_template(
        "dashboard.html",
        username=current_user.username,
        messages=[]
    )


# ==========================================
# Chat
# ==========================================

@app.route("/chat", methods=["POST"])
@login_required
def chat():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "Invalid request."
        }), 400

    message = data.get("message", "").strip()
    chat_id = data.get("chat_id")

    if not message:
        return jsonify({
            "success": False,
            "error": "Message cannot be empty."
        }), 400

    try:

        # ----------------------------------
        # Create or load chat
        # ----------------------------------

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
                    "error": "Chat not found."
                }), 404

        # ----------------------------------
        # Save user message
        # ----------------------------------

        db.session.add(
            Message(
                chat_id=chat.id,
                role="user",
                content=message
            )
        )

        # Rename first chat
        if chat.title == "New Chat":

            title = message[:40]

            if len(message) > 40:
                title += "..."

            chat.title = title

        # ----------------------------------
        # Ask AI
        # ----------------------------------

        print("=" * 60)
        print("Before ask_ai()")

        reply = ask_ai(message)

        print("After ask_ai()")
        print("=" * 60)

        # ----------------------------------
        # Save AI reply
        # ----------------------------------

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

        print("=" * 60)
        print("CHAT ROUTE ERROR")
        traceback.print_exc()
        print("=" * 60)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# New Chat
# ==========================================

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


# ==========================================
# Chat List
# ==========================================

@app.route("/chats")
@login_required
def get_chats():

    chats = Chat.query.filter_by(
        user_id=current_user.id
    ).order_by(
        Chat.updated_at.desc()
    ).all()

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "created_at": (
                c.created_at.strftime("%Y-%m-%d %H:%M")
                if c.created_at else ""
            )
        }
        for c in chats
    ])


# ==========================================
# Conversation
# ==========================================

@app.route("/chat/<int:chat_id>")
@login_required
def get_chat(chat_id):

    chat = Chat.query.filter_by(
        id=chat_id,
        user_id=current_user.id
    ).first()

    if not chat:

        return jsonify({
            "success": False,
            "error": "Chat not found."
        }), 404

    return jsonify({

        "success": True,

        "chat_id": chat.id,

        "title": chat.title,

        "messages": [

            {

                "role": m.role,

                "content": m.content

            }

            for m in chat.messages

        ]

    })

# ==========================================
# Upload File
# ==========================================

@app.route("/upload", methods=["POST"])
@login_required
def upload():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "error": "No file uploaded."
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "error": "No selected file."
        }), 400

    print("=" * 60)
    print("UPLOAD ROUTE START")
    print("request.files =", request.files)
    print("secure_filename =", secure_filename)
    print("file.filename =", file.filename)
    print("=" * 60)

    filename = secure_filename(file.filename)

    print("Safe filename =", filename)

    try:

        ext = filename.rsplit(".", 1)[-1].lower()

        if ext == "pdf":
            folder = "uploads/pdf"

        elif ext in ["doc", "docx"]:
            folder = "uploads/docx"

        elif ext in ["xls", "xlsx", "csv"]:
            folder = "uploads/excel"

        elif ext in ["png", "jpg", "jpeg", "gif", "webp"]:
            folder = "uploads/images"

        else:
            folder = "uploads/txt"

        os.makedirs(folder, exist_ok=True)

        filepath = os.path.join(folder, filename)

        file.save(filepath)

        print("FILE SAVED:", filepath)

        return jsonify({
            "success": True,
            "filename": filename,
            "filepath": filepath
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
# Browser Closed
# ==========================

@app.route("/logout-session", methods=["POST"])
@login_required
def logout_session():

    current_user.session_id = None
    current_user.last_activity = None

    db.session.commit()

    return "", 204


# ==========================
# Heartbeat
# ==========================

@app.route("/heartbeat", methods=["POST"])
@login_required
def heartbeat():

    from datetime import datetime, timezone

    current_user.last_activity = datetime.now(timezone.utc)

    db.session.commit()

    return "", 204


# ==========================================
# Startup
# ==========================================

print("=" * 60)

print(app.url_map)

print("=" * 60)


# ==========================================
# Run
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
