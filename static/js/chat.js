/* ==========================================
   LYRCH AI CHAT MANAGER
========================================== */

"use strict";

const Chat = {

    currentChatId: null,

    loading: false,

    chatting: false

};

/* ==========================================
   SEND MESSAGE
========================================== */

async function sendMessage() {

    if (Chat.loading) return;

    const message = UI.prompt.value.trim();

    if (!message) return;

    Chat.loading = true;

    if (!Chat.chatting) {

        Chat.chatting = true;

        showChat();

    }

    addMessage("user", message);

    UI.prompt.value = "";

    autoResize();

    showLoading();

    try {

        const data = await API.sendMessage(

            message,

            Chat.currentChatId

        );

        hideLoading();

        Chat.currentChatId = data.chat_id;

        addMessage(

            "assistant",

            data.reply

        );

        loadChats();

    }

    catch(err){

        hideLoading();

        addMessage(

            "assistant",

            "❌ " + err.message

        );

        console.error(err);

    }

    Chat.loading = false;

}

/* ==========================================
   NEW CHAT
========================================== */

function newChat(){

    Chat.currentChatId = null;

    Chat.chatting = false;

    clearMessages();

    showHero();

}

/* ==========================================
   LOAD CONVERSATION
========================================== */

async function loadConversation(chatId){

    try{

        const data = await API.getConversation(chatId);

        Chat.currentChatId = chatId;

        Chat.chatting = true;

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
