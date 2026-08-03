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
