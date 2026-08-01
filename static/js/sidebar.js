/* ==========================================
   LYRCH AI SIDEBAR
========================================== */

"use strict";

/* ==========================================
   LOAD CHATS
========================================== */

async function loadChats() {

    if (!UI.chatList) return;

    try {

        const chats = await API.getChats();

        UI.chatList.innerHTML = "";

        chats.forEach(chat => {

            const item = document.createElement("button");

            item.className = "chat-item";

            item.textContent = "💬 " + truncate(chat.title);

            if (chat.id === Chat.currentChatId) {
                item.classList.add("active");
            }

            item.addEventListener("click", () => {

                loadConversation(chat.id);

            });

            UI.chatList.appendChild(item);

        });

    }

    catch (err) {

        console.error("Unable to load chats:", err);

    }

}
