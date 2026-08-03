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
# Run App
# ==========================

if __name__ == "__main__":
    app.run(debug=True)
