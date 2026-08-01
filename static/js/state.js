/* ==========================================
   LYRCH AI STATE
========================================== */

"use strict";

const State = {

    // Chat
    currentChatId: null,

    chatting: false,

    loading: false,

    // Future Features
    model: "OpenAI",

    streaming: false,

    uploadedFiles: []

};

window.State = State;
