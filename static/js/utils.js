/* ==========================================
   LYRCH AI UTILS
========================================== */

"use strict";

/* ==========================================
   Escape HTML
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

/* ==========================================
   Create Element
========================================== */

function createElement(tag, className = "") {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;

}

/* ==========================================
   Truncate Text
========================================== */

function truncate(text, length = 40) {

    if (!text) return "";

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + "...";

}

/* ==========================================
   Scroll To Bottom
========================================== */

function scrollToBottom(container) {

    if (!container) return;

    container.scrollTop = container.scrollHeight;

}

/* ==========================================
   Debounce
========================================== */

function debounce(func, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            func(...args);

        }, delay);

    };

}

/* ==========================================
   Format Date
========================================== */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();

}
