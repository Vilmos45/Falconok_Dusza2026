import { generateTable } from "./ui.js";

const table = document.getElementById("table");
const fileInput = document.getElementById("fileInput");

const allowedExtensions = ["txt", "map", "csv", "tsv", "ms", "minescript"];
const validCells = [">", "^", "v", "<", ".", "#", "@"];

// Drag & Drop
table.addEventListener("dragover", e => {
    e.preventDefault();
    table.classList.add("dragover");
});

table.addEventListener("dragleave", () => {
    table.classList.remove("dragover");
});

table.addEventListener("drop", e => {
    e.preventDefault();
    table.classList.remove("dragover");

    if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

// File picker
fileInput.addEventListener("change", e => {
    if (e.target.files[0])
        loadFile(e.target.files[0]);

    fileInput.value = "";
});

function parseMap(content) {
    const lines = content
        .replace(/^\uFEFF/, "")
        .replace(/\r/g, "")
        .split("\n")
        .filter(line => line.trim() !== "");
    const dimensions = lines.shift().trim().split(/\s+/);

    if (
        dimensions.length !== 2 ||
        !/^\d+$/.test(dimensions[0]) ||
        !/^\d+$/.test(dimensions[1])
    ) {
        throw new Error("Invalid map dimensions!");
    }

    const [width, height] = dimensions.map(Number);

    if (width < 1 || height < 1 || width > 15 || height > 15)
        throw new Error("Map size must be between 1x1 and 15x15!");

    if (lines.length !== height)
        throw new Error(`Expected ${height} rows, got ${lines.length}!`);

    const arr = lines.map(line => {
        if (/\s/.test(line.trim())) {
            return line.trim().split(/\s+/);
        }

        if (width > 1)
            console.warn("Map cells are not space-separated!");

        return [...line.trim()];
    });

    for (let i = 0; i < height; i++) {
        if (arr[i].length !== width)
            throw new Error(`Invalid number of cells in row ${i + 1}!`);

        for (const cell of arr[i]) {
            if (!validCells.includes(cell))
                throw new Error(`Unknown cell: ${cell}`);
        }
    }

    generateTable(height, width, arr);
}


function parseMineScript(content = "") {
    if (!content.trim()) return [];

    const lines = content
        .replace(/\r/g, "")
        .split("\n");

    console.log("MineScript loaded:", lines);

    document.getElementById("terminal").textContent = lines;
}

function loadFile(file) {
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        alert("Unsupported file format!");
        return;
    }

    const reader = new FileReader();

    reader.onload = e => {
        try {
            const content = e.target.result;

            if (["ms", "minescript"].includes(extension)) {
                const script = parseMineScript(content);
                console.log("MineScript:", script);
            } else
                parseMap(content);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    reader.onerror = () => {
        alert("File reading failed!");
    };

    reader.readAsText(file);
}
