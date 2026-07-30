/* ===========================================
   LYRCH AI
   Frontend Controller
=========================================== */

const hero = document.getElementById("hero");
const chatArea = document.getElementById("chatArea");

const input = document.getElementById("promptInput");

const sendBtn = document.querySelector(".send-btn");

const featureCards = document.querySelectorAll(".feature-card");


/* ===========================================
   Suggested prompts
=========================================== */

const prompts = [

"Help me write Python code.",

"Write a professional email.",

"Summarize this document.",

"Brainstorm startup ideas."

];


/* ===========================================
   Feature Cards
=========================================== */

featureCards.forEach((card,index)=>{

    card.addEventListener("click",()=>{

        input.value = prompts[index];

        input.focus();

    });

});


/* ===========================================
   Send
=========================================== */

sendBtn.addEventListener("click",sendMessage);

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});


/* ===========================================
   Main
=========================================== */

async function sendMessage(){

    const message = input.value.trim();

    if(message==="") return;


    showChat();

    addUserMessage(message);

    input.value="";


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

    addAIMessage(data.reply);

}
catch(error){

    addAIMessage("⚠ Unable to connect to Lyrch AI.");

    console.error(error);

}


}


/* ===========================================
   Show Chat
=========================================== */

function showChat(){

    hero.classList.add("hero-hidden");

    chatArea.classList.remove("chat-hidden");

    chatArea.classList.add("chat-visible");

}


/* ===========================================
   User Message
=========================================== */

function addUserMessage(text){

    const bubble=document.createElement("div");

    bubble.className="message user";

    bubble.innerHTML=`

        <div class="bubble">

            ${text}

        </div>

    `;

    chatArea.appendChild(bubble);

    chatArea.scrollTop=chatArea.scrollHeight;

}
