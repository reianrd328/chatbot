/* ==========================================
   LYRCH AI CHAT ENGINE
========================================== */

"use strict";

/* ==========================================
   SEND MESSAGE
========================================== */

async function sendMessage() {

    console.log("===== sendMessage START =====");

    console.log("State:", State);
    console.log("UI.prompt:", UI.prompt);

    if (State.loading) {
        console.log("Already loading");
        return;
    }

    const message = UI.prompt.value.trim();

    console.log("Message:", message);

    if (!message) {
        console.log("Empty message");
        return;
    }

    console.log("Calling API...");

    addMessage("user", message);

    UI.prompt.value = "";

    autoResize();

    showLoading();

    try {

    const data = await API.sendMessage(

        message,

        State.currentChatId

    );

    console.log("========== SERVER RESPONSE ==========");
    console.log(data);
    console.log("====================================");

    hideLoading();

    State.currentChatId = data.chat_id;

    addMessage(

        "assistant",

        data.reply

    );

    await loadChats();

}
    catch(err){

        hideLoading();

        addMessage(

            "assistant",

            "❌ " + err.message

        );

        console.error(err);

    }

    finally{

        State.loading = false;

    }

}

/* ==========================================
   NEW CHAT
========================================== */

function newChat(){

    State.currentChatId = null;

    State.chatting = false;

    clearMessages();

    showHero();

}

/* ==========================================
   LOAD CONVERSATION
========================================== */

async function loadConversation(chatId){

    try{

        const data = await API.getConversation(chatId);

        State.currentChatId = chatId;

        State.chatting = true;

        clearMessages();

        showChat();

        data.messages.forEach(msg=>{

            addMessage(

                msg.role,

                msg.content

            );

        });

    }

    catch(err){

        console.error(err);

    }

}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.sendMessage = sendMessage;

window.newChat = newChat;

window.loadConversation = loadConversation;
