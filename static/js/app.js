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

const sendBtn = document.querySelector(".send-btn");
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
        sendBtn.addEventListener("click", sendMessage);

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
    PLACE HOLDERS
========================================================== */

async function sendMessage() {

    console.log("Send Message");

}

function startNewChat() {

    console.log("New Chat");

}

/* ==========================================================
    SEND MESSAGE
========================================================== */

async function sendMessage() {

    if (state.loading) return;

    const message = promptInput.value.trim();

    if (!message) return;

    // Hide hero on first message
    if (!state.chatting) {

        state.chatting = true;

        hero.classList.remove("hero-visible");
        hero.classList.add("hero-hidden");

        chatArea.classList.remove("chat-hidden");
        chatArea.classList.add("chat-visible");

    }

    addMessage("user", message);

    promptInput.value = "";

    autoResize();

    // Placeholder until Flask API is connected
    setTimeout(() => {

        addMessage(
            "assistant",
            "Thinking... Flask API will be connected in Part 3."
        );

    }, 500);

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

    const wrapper = document.createElement("div");

    wrapper.className = `message ${role}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    chatMessages.appendChild(wrapper);

    scrollToBottom();

}


/* ==========================================================
    SCROLL
========================================================== */

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

