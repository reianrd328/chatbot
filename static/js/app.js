/* ===========================================
   LYRCH AI
   app.js
   Version: 1.0
   Part 1 / 4
=========================================== */

/* ===========================================
   DOM ELEMENTS
=========================================== */

const hero = document.getElementById("hero");
const chatArea = document.getElementById("chatArea");

const input = document.getElementById("promptInput");

const sendBtn = document.querySelector(".send-btn");

const featureCards = document.querySelectorAll(".feature-card");


/* ===========================================
   APP CONFIG
=========================================== */

const CONFIG = {

    apiUrl: "/chat",

    typingText: "Lyrch AI is thinking...",

    maxMessageLength: 8000,

    autoScroll: true

};


/* ===========================================
   APP STATE
=========================================== */

const state = {

    sending: false,

    conversationId: null,

    messages: [],

    initialized: false

};


/* ===========================================
   FEATURE CARD PROMPTS
=========================================== */

const prompts = [

    "Help me write Python code.",

    "Write a professional email.",

    "Summarize this document.",

    "Brainstorm startup ideas."

];


/* ===========================================
   INITIALIZE APPLICATION
=========================================== */

document.addEventListener("DOMContentLoaded", initializeApp);


function initializeApp(){

    if(state.initialized) return;

    state.initialized = true;

    setupEventListeners();

    setupFeatureCards();

    console.log("✓ Lyrch AI Initialized");

}


/* ===========================================
   EVENT LISTENERS
=========================================== */

function setupEventListeners(){

    if(sendBtn){

        sendBtn.addEventListener("click", sendMessage);

    }

    if(input){

        input.addEventListener("keydown", handleInputKeys);

    }

}


/* ===========================================
   KEYBOARD
=========================================== */

function handleInputKeys(event){

    // ENTER = SEND

    if(event.key==="Enter" && !event.shiftKey){

        event.preventDefault();

        sendMessage();

    }

}


/* ===========================================
   FEATURE CARDS
=========================================== */

function setupFeatureCards(){

    featureCards.forEach((card,index)=>{

        card.addEventListener("click",()=>{

            input.value = prompts[index];

            input.focus();

        });

    });

}


/* ===========================================
   SEND MESSAGE
=========================================== */

async function sendMessage(){

   console.log("SEND BUTTON CLICKED");
   
    if(state.sending){

        return;

    }

    const message = input.value.trim();

    if(message===""){

        return;

    }

    if(message.length > CONFIG.maxMessageLength){

        alert("Message is too long.");

        return;

    }

    state.sending = true;

    sendBtn.disabled = true;

    showChat();

    addUserMessage(message);

    state.messages.push({

        role:"user",

        content:message,

        time:new Date()

    });

    input.value="";

    input.focus();

    const loading = addLoadingMessage();

    try{

        const reply = await sendToFlask(message);

        removeLoadingMessage(loading);

        addAIMessage(reply);

        state.messages.push({

            role:"assistant",

            content:reply,

            time:new Date()

        });

    }

    catch(error){

        removeLoadingMessage(loading);

        addErrorMessage(error.message);

        console.error(error);

    }

    finally{

        state.sending = false;

        sendBtn.disabled = false;

    }

}

/* ===========================================
   SHOW CHAT
=========================================== */

function showChat(){

    hero.classList.add("hero-hidden");

    chatArea.classList.remove("chat-hidden");

    chatArea.classList.add("chat-visible");

}


/* ===========================================
   CREATE MESSAGE
=========================================== */

function createMessage(role, text){

    const wrapper = document.createElement("div");

    wrapper.className = `message ${role}`;

    const bubble = document.createElement("div");

    if(role === "user"){

        bubble.className = "bubble";

    }else{

        bubble.className = "bubble ai-bubble";

    }

    bubble.innerHTML = formatMessage(text);

    wrapper.appendChild(bubble);

    chatArea.appendChild(wrapper);

    scrollToBottom();

    return wrapper;

}


/* ===========================================
   USER MESSAGE
=========================================== */

function addUserMessage(text){

    createMessage("user", text);

}


/* ===========================================
   AI MESSAGE
=========================================== */

function addAIMessage(text){

    createMessage("ai", text);

}


/* ===========================================
   ERROR MESSAGE
=========================================== */

function addErrorMessage(text){

    const wrapper = document.createElement("div");

    wrapper.className = "message ai";

    wrapper.innerHTML = `

        <div class="bubble ai-bubble error-bubble">

            ⚠ ${text}

        </div>

    `;

    chatArea.appendChild(wrapper);

    scrollToBottom();

}


/* ===========================================
   LOADING MESSAGE
=========================================== */

function addLoadingMessage(){

    const wrapper = document.createElement("div");

    wrapper.className = "message ai loading-message";

    wrapper.innerHTML = `

        <div class="bubble ai-bubble loading-bubble">

            <span class="loading-dot"></span>

            <span class="loading-dot"></span>

            <span class="loading-dot"></span>

            <span class="loading-text">

                ${CONFIG.typingText}

            </span>

        </div>

    `;

    chatArea.appendChild(wrapper);

    scrollToBottom();

    return wrapper;

}


/* ===========================================
   REMOVE LOADING
=========================================== */

function removeLoadingMessage(node){

    if(node){

        node.remove();

    }

}


/* ===========================================
   FORMAT MESSAGE
=========================================== */

function formatMessage(text){

    if(!text){

        return "";

    }

    return text
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/\n/g,"<br>");

}


/* ===========================================
   AUTO SCROLL
=========================================== */

function scrollToBottom(){

    if(!CONFIG.autoScroll){

        return;

    }

    requestAnimationFrame(()=>{

        chatArea.scrollTop = chatArea.scrollHeight;

    });

}


/* ===========================================
   CLEAR CHAT
=========================================== */

function clearChat(){

    chatArea.innerHTML = "";

}


/* ===========================================
   TIMESTAMP
=========================================== */

function formatTime(date){

    return date.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}

/* ===========================================
   API
=========================================== */

async function sendToFlask(message){

    const payload = {

        message: message,

        conversation_id: state.conversationId

    };

    const response = await fetch(CONFIG.apiUrl, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(payload)

    });

    if(!response.ok){

        let errorMessage = "Server Error";

        try{

            const error = await response.json();

            errorMessage = error.error || error.message || errorMessage;

        }

        catch(e){

            errorMessage = `HTTP ${response.status}`;

        }

        throw new Error(errorMessage);

    }

    const data = await response.json();

    if(data.conversation_id){

        state.conversationId = data.conversation_id;

    }

    return data.reply || "No response from AI.";

}


/* ===========================================
   SAVE MESSAGE
=========================================== */

function saveMessage(role, content){

    state.messages.push({

        role,

        content,

        created_at:new Date()

    });

}


/* ===========================================
   GET HISTORY
=========================================== */

function getConversation(){

    return state.messages;

}


/* ===========================================
   RESET CONVERSATION
=========================================== */

function newConversation(){

    state.messages = [];

    state.conversationId = null;

    clearChat();

    hero.classList.remove("hero-hidden");

    hero.classList.add("hero-visible");

    chatArea.classList.remove("chat-visible");

    chatArea.classList.add("chat-hidden");

}


/* ===========================================
   COPY TO CLIPBOARD
=========================================== */

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        console.log("Copied.");

    }

    catch(error){

        console.error(error);

    }

}


/* ===========================================
   EXPORT CHAT
=========================================== */

function exportConversation(){

    let output = "";

    state.messages.forEach(message=>{

        output += `[${message.role.toUpperCase()}]\n`;

        output += message.content;

        output += "\n\n";

    });

    const blob = new Blob([output],{

        type:"text/plain"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "conversation.txt";

    a.click();

    URL.revokeObjectURL(url);

}


/* ===========================================
   CONNECTION CHECK
=========================================== */

async function pingServer(){

    try{

        const response = await fetch("/");

        return response.ok;

    }

    catch(error){

        return false;

    }

}


/* ===========================================
   DEBUG
=========================================== */

function debug(){

    console.table(state.messages);

}


/* ===========================================
   READY
=========================================== */

console.log("✓ API Module Loaded");

/* ===========================================
   PART 4
   UTILITIES & FINAL SETUP
=========================================== */

/* ===========================================
   MARKDOWN (Basic)
=========================================== */

function parseMarkdown(text){

    if(!text) return "";

    return text

        // Bold
        .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")

        // Italic
        .replace(/\*(.*?)\*/g,"<em>$1</em>")

        // Inline Code
        .replace(/`([^`]+)`/g,"<code>$1</code>")

        // New Line
        .replace(/\n/g,"<br>");

}


/* ===========================================
   FORMAT AI MESSAGE
=========================================== */

function formatAIMessage(text){

    return parseMarkdown(text);

}


/* ===========================================
   MESSAGE ANIMATION
=========================================== */

function animateMessage(element){

    element.animate(

        [

            {

                opacity:0,

                transform:"translateY(15px)"

            },

            {

                opacity:1,

                transform:"translateY(0)"

            }

        ],

        {

            duration:250,

            easing:"ease-out"

        }

    );

}


/* ===========================================
   UPDATE EXISTING MESSAGE FUNCTIONS
=========================================== */

const oldCreateMessage = createMessage;

createMessage = function(role,text){

    const wrapper = oldCreateMessage(role,text);

    animateMessage(wrapper);

    return wrapper;

};


/* ===========================================
   ESCAPE HTML
=========================================== */

function escapeHTML(text){

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}


/* ===========================================
   COPY AI RESPONSE
=========================================== */

function addCopyButtons(){

    document.querySelectorAll(".message.ai").forEach(message=>{

        if(message.querySelector(".copy-btn")){

            return;

        }

        const btn=document.createElement("button");

        btn.className="copy-btn";

        btn.innerText="Copy";

        btn.onclick=()=>{

            navigator.clipboard.writeText(

                message.innerText.replace("Copy","")

            );

            btn.innerText="Copied!";

            setTimeout(()=>{

                btn.innerText="Copy";

            },1500);

        };

        message.appendChild(btn);

    });

}


/* ===========================================
   OBSERVER
=========================================== */

const observer=new MutationObserver(()=>{

    addCopyButtons();

});

observer.observe(chatArea,{

    childList:true

});


/* ===========================================
   CLEAR INPUT
=========================================== */

function clearInput(){

    input.value="";

}


/* ===========================================
   ENABLE SEND
=========================================== */

function enableSend(){

    sendBtn.disabled=false;

}


/* ===========================================
   DISABLE SEND
=========================================== */

function disableSend(){

    sendBtn.disabled=true;

}


/* ===========================================
   LOADING STATE
=========================================== */

function setLoading(isLoading){

    if(isLoading){

        disableSend();

    }

    else{

        enableSend();

    }

}


/* ===========================================
   RESET APP
=========================================== */

function resetApplication(){

    newConversation();

    clearInput();

    state.messages=[];

    state.conversationId=null;

}


/* ===========================================
   VERSION
=========================================== */

const LYRCH_VERSION="1.0.0";


/* ===========================================
   STARTUP
=========================================== */

window.addEventListener("load",()=>{

    console.log("--------------------------------");

    console.log("Lyrch AI");

    console.log("Version:",LYRCH_VERSION);

    console.log("Frontend Ready");

    console.log("--------------------------------");

});
