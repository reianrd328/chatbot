/* ==========================================================
    LYRCH AI
    Frontend Controller v2
========================================================== */

"use strict";

/* ==========================================================
    DOM ELEMENTS
========================================================== */

const hero = document.getElementById("hero");
const chatArea = document.getElementById("chatArea");
const chatMessages = document.getElementById("chatMessages");

const promptInput = document.getElementById("promptInput");

console.log("Prompt Element:", promptInput);
const sendBtn = document.querySelector(".send-btn");

console.log("Send Button =", sendBtn);
const newChatBtn = document.querySelector(".new-chat");
const chatList = document.getElementById("chatList");

const featureCards = document.querySelectorAll(".feature-card");

/* ==========================================================
    APP STATE
========================================================== */

const state = {
    chatting: false,
    loading: false,

    // Current conversation
    currentChatId: null
};

/* ==========================================================
    INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("✓ Lyrch AI Loaded");

    bindEvents();

    autoResize();

    loadChats();

});
/* ==========================================================
    EVENTS
========================================================== */

function bindEvents() {

    if (sendBtn)
        sendBtn.onclick = () => {

    console.log("BUTTON CLICKED");

    sendMessage();

};

    if (promptInput) {

        promptInput.addEventListener("keydown", (e) => {

            if (e.key === "Enter" && !e.shiftKey) {

                e.preventDefault();

                sendMessage();

            }

        });

        promptInput.addEventListener("input", autoResize);

    }

    if (newChatBtn)
        newChatBtn.addEventListener("click", startNewChat);

    featureCards.forEach(card => {

        card.addEventListener("click", () => {

            const title = card.querySelector("h3").textContent;

            switch (title) {

                case "Code Assistant":
                    promptInput.value = "Help me write Python code.";
                    break;

                case "Writing Studio":
                    promptInput.value = "Write a professional email.";
                    break;

                case "Document AI":
                    promptInput.value = "Summarize this document.";
                    break;

                case "Idea Lab":
                    promptInput.value = "Brainstorm startup ideas.";
                    break;

            }

            autoResize();

            promptInput.focus();

        });

    });

}

/* ==========================================================
    AUTO RESIZE
========================================================== */

function autoResize() {

    if (!promptInput) return;

    promptInput.style.height = "auto";

    promptInput.style.height =
        promptInput.scrollHeight + "px";

}



/* ==========================================================
    SEND MESSAGE
========================================================== */

async function sendMessage() {

    if (state.loading) return;

    const message = promptInput.value.trim();

    if (!message) return;

    state.loading = true;

    // Hide hero only once
    if (!state.chatting) {

        state.chatting = true;

        hero.classList.remove("hero-visible");
        hero.classList.add("hero-hidden");

        chatArea.classList.remove("chat-hidden");
        chatArea.classList.add("chat-visible");
    }

    // Show user message
    addMessage("user", message);

    // Clear input
    promptInput.value = "";
    autoResize();

    // Loading indicator
    const loading = addLoadingMessage();

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

    message: message,

    chat_id: state.currentChatId

})

        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
         const isNewChat = state.currentChatId === null;

if (data.chat_id) {
    state.currentChatId = data.chat_id;
}

if (isNewChat) {
    loadChats();
}

console.log("Current Chat:", state.currentChatId);

        loading.remove();

        addMessage(
            "assistant",
            data.reply || "No response received."
        );

    } catch (err) {

        console.error(err);

        loading.remove();

        addMessage(
            "assistant",
            "❌ Unable to contact the AI server."
        );

    } finally {

        state.loading = false;

    }

}
/* ==========================================================
    NEW CHAT
========================================================== */

function startNewChat() {
    state.currentChatId = null;
    state.chatting = false;

    chatMessages.innerHTML = "";

    hero.classList.remove("hero-hidden");
    hero.classList.add("hero-visible");

    chatArea.classList.remove("chat-visible");
    chatArea.classList.add("chat-hidden");

    promptInput.value = "";

    autoResize();
loadChats();
}

/* ==========================================================
    LOAD CHAT LIST
========================================================== */

async function loadChats() {

    if (!chatList) return;

    try {

        const response = await fetch("/chats");

        const chats = await response.json();

        chatList.innerHTML = "";

        chats.forEach(chat => {

            const item = document.createElement("button");

            item.className = "chat-item";

            item.innerHTML = `💬 ${chat.title}`;

            item.onclick = () => loadConversation(chat.id);

            chatList.appendChild(item);

        });

    } catch (err) {

        console.error("Unable to load chats:", err);

    }

}

/* ==========================================================
    LOAD ONE CONVERSATION
========================================================== */

async function loadConversation(chatId) {

    try {

        const response = await fetch(`/chat/${chatId}`);

        const data = await response.json();

        if (!data.success) return;

        state.currentChatId = chatId;

        state.chatting = true;

        hero.classList.remove("hero-visible");
        hero.classList.add("hero-hidden");

        chatArea.classList.remove("chat-hidden");
        chatArea.classList.add("chat-visible");

        chatMessages.innerHTML = "";

        data.messages.forEach(msg => {

            addMessage(msg.role, msg.content);

        });

        scrollToBottom();

    } catch (err) {

        console.error(err);

    }

}
/* ==========================================================
    MESSAGE RENDERER
========================================================== */

function addMessage(role, text) {

    console.log("addMessage called");

    console.log(chatMessages);

    const wrapper = document.createElement("div");

    wrapper.className = `message ${role}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    chatMessages.appendChild(wrapper);
    console.log(chatMessages.innerHTML);

    console.log("message added");

}
/* ==========================================================
    SCROLL
========================================================== */

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

}
/* ==========================================================
    LOADING MESSAGE
========================================================== */

function addLoadingMessage() {

    const wrapper = document.createElement("div");

    wrapper.className = "message assistant loading";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = "Thinking...";

    wrapper.appendChild(bubble);

    chatMessages.appendChild(wrapper);

    scrollToBottom();

    return wrapper;

}

