const messages = document.getElementById("messages");
const textarea = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// Auto resize textarea
textarea.addEventListener("input", () => {
    textarea.style.height = "60px";
    textarea.style.height = textarea.scrollHeight + "px";
});

// Enter to send
textarea.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();
    }

});

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {

    const text = textarea.value.trim();

    if (!text) return;

    // Remove welcome screen
    const welcome = document.querySelector(".welcome");

    if (welcome)
        welcome.remove();

    addUserMessage(text);

    textarea.value = "";
    textarea.style.height = "60px";

    showTyping();

    // Fake AI reply (temporary)
    setTimeout(() => {

        removeTyping();

        addBotMessage(
            "Hello! 👋\n\nNext phase we'll connect to HCNSec AI."
        );

    }, 1500);

}

function addUserMessage(text){

    messages.insertAdjacentHTML(
        "beforeend",
        `
        <div class="message user">

            <div class="bubble user-bubble">
                ${escapeHtml(text)}
            </div>

            <div class="avatar user-avatar">
                👤
            </div>

        </div>
        `
    );

    scrollBottom();

}

function addBotMessage(text){

    messages.insertAdjacentHTML(
        "beforeend",
        `
        <div class="message bot">

            <div class="avatar ai-avatar">
                🤖
            </div>

            <div class="bubble bot-bubble">
                ${text.replace(/\n/g,"<br>")}
            </div>

        </div>
        `
    );

    scrollBottom();

}

function showTyping(){

    messages.insertAdjacentHTML(
        "beforeend",
        `
        <div class="message bot" id="typing">

            <div class="avatar ai-avatar">
                🤖
            </div>

            <div class="bubble bot-bubble">

                <div class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        </div>
        `
    );

    scrollBottom();

}

function removeTyping(){

    const t=document.getElementById("typing");

    if(t) t.remove();

}

function scrollBottom(){

    messages.scrollTop=messages.scrollHeight;

}

function escapeHtml(text){

    const div=document.createElement("div");

    div.innerText=text;

    return div.innerHTML;

}
