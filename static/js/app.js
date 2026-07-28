function addUserMessage(text){

    const html = `
    <div class="message user">
        <div class="avatar">🧑</div>

        <div class="bubble user-bubble">
            ${text}
        </div>
    </div>
    `;

    messages.insertAdjacentHTML("beforeend", html);

    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(text){

    const html = `
    <div class="message bot">
        <div class="avatar">🤖</div>

        <div class="bubble bot-bubble">
            ${text}
        </div>
    </div>
    `;

    messages.insertAdjacentHTML("beforeend", html);

    messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", ()=>{

    const text = textarea.value.trim();

    if(text==="") return;

    addUserMessage(text);

    textarea.value="";

    // temporary fake reply
    setTimeout(()=>{
        addBotMessage("Hello! Soon I'll be connected to HCNSec AI.");
    },800);

});
