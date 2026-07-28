const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const textarea = document.getElementById("message");

sendBtn.addEventListener("click", () => {

    const text = textarea.value.trim();

    if (!text) return;

    messages.innerHTML += `
        <div style="text-align:right;margin:20px;">
            <div style="
                display:inline-block;
                background:#10a37f;
                padding:15px;
                border-radius:12px;
                max-width:70%;
            ">
                ${text}
            </div>
        </div>
    `;

    textarea.value="";

    messages.scrollTop = messages.scrollHeight;

});
