/* ==========================================
   LYRCH AI
   Frontend Controller v2
========================================== */

"use strict";

/* ==========================================
   DOM ELEMENTS
========================================== */

const hero = document.getElementById("hero");
const chatArea = document.getElementById("chatArea");
const chatMessages = document.getElementById("chatMessages");

const promptInput = document.getElementById("promptInput");

const sendBtn = document.querySelector(".send-btn");
const newChatBtn = document.querySelector(".new-chat");

const featureCards = document.querySelectorAll(".feature-card");


/* ==========================================
   APP STATE
========================================== */

const state = {

    chatting: false,

    loading: false

};


/* ==========================================
   INITIALIZE
========================================== */

init();

function init() {

    console.log("✓ Lyrch AI Initialized");

    bindEvents();

}


/* ==========================================
   EVENT LISTENERS
========================================== */

function bindEvents() {

    console.log("Binding Events...");

    console.log(sendBtn);
    console.log(promptInput);
    console.log(newChatBtn);

    if (!sendBtn || !promptInput || !newChatBtn) {
        console.error("Some DOM elements were not found.");
        return;
    }

    sendBtn.addEventListener("click", sendMessage);

    promptInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter" && !event.shiftKey) {

            event.preventDefault();

            sendMessage();

        }

    });

    newChatBtn.addEventListener("click", startNewChat);

    featureCards.forEach(card => {

        card.addEventListener("click", () => {

            console.log("Feature card clicked");

        });

    });

}
    // New Chat
    newChatBtn.addEventListener("click", startNewChat);

    // Feature Cards
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

            promptInput.focus();

        });

    });

}


/* ==========================================
   PLACEHOLDERS
   (implemented in next module)
========================================== */

async function sendMessage() {

    console.log("SEND MESSAGE");

}

function startNewChat() {

    console.log("NEW CHAT");

}
