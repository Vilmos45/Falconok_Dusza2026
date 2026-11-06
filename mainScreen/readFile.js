import { generateTable } from "./ui.js";

const table = document.getElementById("table");
const fileInput = document.getElementById("fileInput")

table.addEventListener("dragover", (e) => {
    e.preventDefault();
    table.classList.add("dragover");
});
table.addEventListener("dragleave", () => {
    table.classList.remove("dragover");
});
table.addEventListener("drop", (e) => {
    e.preventDefault();
    table.classList.remove("dragover");
    const file = e.dataTransfer.files[0];

    if (file) loadFile(file);
});
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) loadFile(file);
});

function parseMap(content) {
    const arr = content
        .replace(/\r/g, "")
        .split("\n")
        .filter(line => line.length > 0)
        .map(line => [...line]);

    if (arr.length > 15 || Math.max(...arr.map(row => row.length)) > 15) {
        alert("Túl nagy bemenet!");
        return;
    }

    generateTable(arr.length, Math.max(...arr.map(row => row.length)), arr);
}

function loadFile(file) {
    const allowedExtensions = ["txt", "map", "csv"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        alert("Nem támogatott fájlformátum!");
        return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        console.log("Fájl tartalma:\n", content);
        parseMap(content);
    };
    reader.onerror = () => { alert("Hiba történt a fájl beolvasásakor!"); };
    reader.readAsText(file);
}