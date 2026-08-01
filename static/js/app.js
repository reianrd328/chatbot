/* ==========================================
   LYRCH AI API
========================================== */

"use strict";

const API = {

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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to send message.");
        }

        return data;

    },

    async getChats() {

        const response = await fetch("/chats");

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Unable to load chats.");
        }

        return data;

    },

    async getConversation(chatId) {

        const response = await fetch(`/chat/${chatId}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Unable to load conversation.");
        }

        return data;

    },

    async newChat() {

        const response = await fetch("/chat/new", {

            method: "POST"

        });

        return await response.json();

    }

};
