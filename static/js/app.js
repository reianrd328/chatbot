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

const featureCards = document.querySelectorAll(".feature-card");

/* ==========================================================
    APP STATE
========================================================== */

const state = {
    chatting: false,
    loading: false
};

/* ==========================================================
    INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("✓ Lyrch AI Loaded");

    bindEvents();

    autoResize();

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

    console.log("1. sendMessage started");

    if (state.loading) {
        console.log("2. Already loading");
        return;
    }

    const message = promptInput.value.trim();

    console.log("3. Message =", message);

    if (!message) {
        console.log("4. Empty message");
        return;
    }

    try {

        console.log("5. Before hero");

        if (!state.chatting) {

            state.chatting = true;

            console.log("6. Hiding hero");

            hero.classList.remove("hero-visible");
            hero.classList.add("hero-hidden");

            chatArea.classList.remove("chat-hidden");
            chatArea.classList.add("chat-visible");
            console.log("Hero classes:", hero.className);
            console.log("Chat classes:", chatArea.className);

        }

        console.log("7. Before addMessage");

        addMessage("user", message);

        console.log("8. After addMessage");

    } catch (err) {

        console.error("ERROR:", err);

    }

}

/* ==========================================================
    NEW CHAT
========================================================== */

function startNewChat() {

    state.chatting = false;

    chatMessages.innerHTML = "";

    hero.classList.remove("hero-hidden");
    hero.classList.add("hero-visible");

    chatArea.classList.remove("chat-visible");
    chatArea.classList.add("chat-hidden");

    promptInput.value = "";

    autoResize();

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

