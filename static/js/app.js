/* ==========================================
   LYRCH AI APP
========================================== */

"use strict";

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", init);

function init() {

    console.log("🚀 Lyrch AI Started");

    bindEvents();

    autoResize();

    loadChats();

    initFeatureCards();

}

/* ==========================================
   BIND EVENTS
========================================== */

function bindEvents() {

    /* Send button */

    UI.send.addEventListener("click", sendMessage);

    /* New Chat */

    UI.newChat.addEventListener("click", newChat);

    /* Enter key */

    UI.prompt.addEventListener("keydown", (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    });

    /* Auto resize */

    UI.prompt.addEventListener("input", autoResize);

}

// Clear session when browser closes
window.addEventListener("beforeunload", () => {
    navigator.sendBeacon("/logout-session");
});

/* ==========================================
   SESSION MANAGEMENT
========================================== */

// Keep session alive while dashboard is open
setInterval(() => {

    fetch("/heartbeat", {
        method: "POST"
    }).catch(err => console.error("Heartbeat failed:", err));

}, 60000);


// Best effort cleanup when browser closes
window.addEventListener("beforeunload", () => {

    navigator.sendBeacon("/logout-session");

});
