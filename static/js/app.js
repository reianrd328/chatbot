const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

function addUserMessage(text) {

    chatBox.innerHTML += `
    <div class="message user">
        <div class="bubble">${text}</div>
    </div>`;
}

function addBotMessage(text) {

    chatBox.innerHTML += `
    <div class="message bot">
        <div class="bubble">${text}</div>
    </div>`;

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

    const message = input.value.trim();

    if(message==="") return;

    addUserMessage(message);

    input.value="";

    addBotMessage("Thinking...");

    const response = await fetch("/chat",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message:message
        })
    });

    const data = await response.json();

    const bubbles = document.querySelectorAll(".bot .bubble");

    bubbles[bubbles.length-1].innerText = data.reply;

    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = sendMessage;

input.addEventListener("keypress",function(e){

    if(e.key==="Enter")
        sendMessage();

});
