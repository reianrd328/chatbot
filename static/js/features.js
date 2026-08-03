"use strict";

function initFeatureCards() {

    const cards = document.querySelectorAll(".feature-card");

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const title = card.querySelector("h3").textContent;

            switch (title) {

                case "Code Assistant":
                    UI.prompt.value = "Help me write Python code.";
                    break;

                case "Writing Studio":
                    UI.prompt.value = "Write a professional email.";
                    break;

                case "Document AI":
                    UI.prompt.value = "Summarize this PDF.";
                    break;

                case "Idea Lab":
                    UI.prompt.value = "Brainstorm startup ideas.";
                    break;

            }

            autoResize();
            UI.prompt.focus();

        });

    });

}

window.initFeatureCards = initFeatureCards;
