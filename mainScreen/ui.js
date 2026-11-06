export {generateTable};
const table = document.getElementById("table");

function generateTable(x, y, arr) {
    table.replaceChildren();
    for (let i = 0; i < x; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < y; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("x", j);
            cell.setAttribute("y", i);
            if (arr?.[i]?.[j] !== undefined) cell.textContent = arr[i][j];
            cell.addEventListener("click",() => {cell.contentEditable = "true"; });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    console.info("Table set!");
}


generateTable(10, 15, "");
