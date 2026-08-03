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

    // Read as text first
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

}

};

// Make API globally available
window.API = API;
