/* ==========================================
   LYRCH AI UI MANAGER
========================================== */

"use strict";

const UI = {

    hero: document.getElementById("hero"),

    chatArea: document.getElementById("chatArea"),

    chatMessages: document.getElementById("chatMessages"),

    prompt: document.getElementById("promptInput"),

    send: document.querySelector(".send-btn"),

    newChat: document.querySelector(".new-chat"),

    chatList: document.getElementById("chatList")

};

/* ==========================================
   SHOW CHAT
========================================== */

function showChat() {

    UI.hero.classList.remove("hero-visible");
    UI.hero.classList.add("hero-hidden");

    UI.chatArea.classList.remove("chat-hidden");
    UI.chatArea.classList.add("chat-visible");

}

/* ==========================================
   SHOW HERO
========================================== */

function showHero() {

    UI.hero.classList.remove("hero-hidden");
    UI.hero.classList.add("hero-visible");

    UI.chatArea.classList.remove("chat-visible");
    UI.chatArea.classList.add("chat-hidden");

}

/* ==========================================
   ADD MESSAGE
========================================== */

function addMessage(role, text) {

    const wrapper = document.createElement("div");

    wrapper.className = `message ${role}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    UI.chatMessages.appendChild(wrapper);

    scrollBottom();

}

/* ==========================================
   LOADING
========================================== */

function showLoading() {

    const wrapper = document.createElement("div");

    wrapper.className = "message assistant loading";

    wrapper.id = "loadingBubble";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = "Thinking...";

    wrapper.appendChild(bubble);

    UI.chatMessages.appendChild(wrapper);

    scrollBottom();

}

function hideLoading() {

    const loading = document.getElementById("loadingBubble");

    if (loading) loading.remove();

}

/* ==========================================
   CLEAR CHAT
========================================== */

function clearMessages() {

    UI.chatMessages.innerHTML = "";

}

/* ==========================================
   SCROLL
========================================== */

function scrollBottom() {

    UI.chatMessages.scrollTop = UI.chatMessages.scrollHeight;

}

/* ==========================================
   AUTO RESIZE
========================================== */

function autoResize() {

    UI.prompt.style.height = "auto";

    UI.prompt.style.height =
        UI.prompt.scrollHeight + "px";

}
