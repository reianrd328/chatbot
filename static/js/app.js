const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
    messages.innerHTML += `
        <div class="message user">
            <div class="bubble">${text}</div>
        </div>
    `;
    scrollBottom();
}

function addBotMessage(text) {
    messages.innerHTML += `
        <div class="message bot">
            <div class="avatar">🤖</div>
            <div class="bubble">${text}</div>
        </div>
    `;
    scrollBottom();
}

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    addUserMessage(message);

    input.value = "";

    addBotMessage("Thinking...");

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        const bubbles = document.querySelectorAll(".message.bot .bubble");

        bubbles[bubbles.length - 1].innerText = data.reply;

        scrollBottom();

    } catch (err) {

        const bubbles = document.querySelectorAll(".message.bot .bubble");

        bubbles[bubbles.length - 1].innerText = "Error connecting to AI.";

    }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
