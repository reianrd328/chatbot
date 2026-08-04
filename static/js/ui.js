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

window.UI = UI;

/* ==========================================
   SHOW HERO
========================================== */

function showHero() {

    console.log("❌ showHero() CALLED");

    UI.hero.classList.remove("hero-hidden");
    UI.hero.classList.add("hero-visible");

    UI.chatArea.classList.remove("chat-visible");
    UI.chatArea.classList.add("chat-hidden");

    console.log("chatArea classes:", UI.chatArea.className);

}
/* ==========================================
   SHOW CHAT
========================================== */

function showChat() {

    console.log("✅ showChat() CALLED");

    UI.hero.classList.remove("hero-visible");
    UI.hero.classList.add("hero-hidden");

    UI.chatArea.classList.remove("chat-hidden");
    UI.chatArea.classList.add("chat-visible");

    console.log("chatArea classes:", UI.chatArea.className);

}
/* ==========================================
   CLEAR MESSAGES
========================================== */

function clearMessages() {

    UI.chatMessages.innerHTML = "";

}

/* ==========================================
   ADD MESSAGE
========================================== */

function addMessage(role, text) {

    const wrapper = document.createElement("div");
    wrapper.className = `message ${role}`;

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = "avatar";

    avatar.textContent =
        role === "assistant"
            ? "✦"
            : "🙂";

    // Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    if(role==="assistant"){

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);

    }else{

        wrapper.appendChild(bubble);
        wrapper.appendChild(avatar);

    }

    UI.chatMessages.appendChild(wrapper);

    scrollBottom();

}
/* ==========================================
   SHOW LOADING
========================================== */

function showLoading() {

    const wrapper = document.createElement("div");

    wrapper.id = "loadingBubble";

    wrapper.className = "message assistant loading";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = "Thinking...";

    wrapper.appendChild(bubble);

    UI.chatMessages.appendChild(wrapper);

    scrollBottom();

}

/* ==========================================
   HIDE LOADING
========================================== */

function hideLoading() {

    const loading = document.getElementById("loadingBubble");

    if (loading) {

        loading.remove();

    }

}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.showHero = showHero;
window.showChat = showChat;
window.clearMessages = clearMessages;
window.addMessage = addMessage;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
