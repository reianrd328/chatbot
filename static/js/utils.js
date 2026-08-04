/* ==========================================
   LYRCH AI UTILITIES
========================================== */

"use strict";

/* ==========================================
   AUTO RESIZE
========================================== */

function autoResize() {

    if (!UI.prompt) return;

    UI.prompt.style.height = "auto";
    UI.prompt.style.height = UI.prompt.scrollHeight + "px";

}

/* ==========================================
   SCROLL TO BOTTOM
========================================== */

function scrollBottom() {

    UI.chatArea.scrollTo({
        top: UI.chatArea.scrollHeight,
        behavior: "smooth"
    });

}
/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

/* ==========================================
   GLOBAL EXPORTS
========================================== */

window.autoResize = autoResize;
window.scrollBottom = scrollBottom;
window.escapeHTML = escapeHTML;
