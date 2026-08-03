/* ==========================================
   LYRCH AI API
========================================== */

"use strict";

const API = {

    /* ==========================================
       SEND MESSAGE
    ========================================== */

    async sendMessage(message, chatId) {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message,
                chat_id: chatId
            })

        });

        const text = await response.text();

        let data;

        try {

            data = JSON.parse(text);

        } catch (err) {

            console.error("Server response:", text);

            throw new Error("Server did not return valid JSON.");

        }

        if (!response.ok) {

            throw new Error(data.error || "Unable to send message.");

        }

        return data;

    },

    /* ==========================================
       LOAD CHATS
    ========================================== */

    async getChats() {

        const response = await fetch("/chats");

        const data = await response.json();

        if (!response.ok) {

            throw new Error("Unable to load chats.");

        }

        return data;

    },

    /* ==========================================
       LOAD ONE CHAT
    ========================================== */

    async getConversation(chatId) {

        const response = await fetch(`/chat/${chatId}`);

        const data = await response.json();

        if (!response.ok) {

            throw new Error("Unable to load conversation.");

        }

        return data;

    }

};

// Make globally available
window.API = API;
