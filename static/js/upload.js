/* ==========================================
   LYRCH AI
   FILE UPLOAD
========================================== */

"use strict";

/* ==========================================
   ELEMENTS
========================================== */

const fileInput = document.getElementById("fileInput");

const attachBtn = document.getElementById("attachBtn");

const uploadedFiles = document.getElementById("uploadedFiles");

/* ==========================================
   OPEN FILE PICKER
========================================== */

if (attachBtn) {

    attachBtn.addEventListener("click", () => {

        fileInput.click();

    });

}

/* ==========================================
   FILE SELECTED
========================================== */

if (fileInput) {

    fileInput.addEventListener("change", async () => {

        if (!fileInput.files.length)
            return;

        const file = fileInput.files[0];

        console.log("Selected file:", file);

        addUploadChip(file);

        await uploadFile(file);

        fileInput.value = "";

    });

}

/* ==========================================
   SHOW FILE CHIP
========================================== */

function addUploadChip(file) {

    const chip = document.createElement("div");

    chip.className = "upload-chip";

    chip.innerHTML = `
        <span>${getFileIcon(file.name)}</span>
        <span>${file.name}</span>
        <button>&times;</button>
    `;

    chip.querySelector("button").onclick = () => {

        chip.remove();

    };

    uploadedFiles.appendChild(chip);

}

/* ==========================================
   FILE ICON
========================================== */

function getFileIcon(name) {

    const ext = name.split(".").pop().toLowerCase();

    switch(ext){

        case "pdf":
            return "📄";

        case "doc":
        case "docx":
            return "📝";

        case "xls":
        case "xlsx":
            return "📊";

        case "txt":
            return "📃";

        case "png":
        case "jpg":
        case "jpeg":
            return "🖼️";

        default:
            return "📁";

    }

}

/* ==========================================
   UPLOAD FILE
========================================== */

async function uploadFile(file){

    const form = new FormData();

    form.append("file", file);

    try{

        console.log("Uploading:", file.name);

        const response = await fetch("/upload",{

            method:"POST",

            body:form

        });

        console.log("Status:", response.status);

        const text = await response.text();

        console.log("Server replied:");
        console.log(text);

        let data = {};

        try{

            data = JSON.parse(text);

        }catch(e){

            console.error("Server did not return JSON.");

            return;

        }

        console.log("Upload Success");

        console.log(data);

    }

    catch(err){

        console.error("UPLOAD ERROR");

        console.error(err);

    }

}
