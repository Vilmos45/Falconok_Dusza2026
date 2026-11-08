export {generateTable, map, robot, mapX, mapY};
const table = document.getElementById("table");

var map = [[]];
const robot = { x: 0, y: 0, dir: 1 };
var mapX;
var mapY;

function generateTable(x, y, arr, init = false) {
    mapX = x;
    mapY = y;
    map = Array.from(
        { length: y },
        (_, i) => Array.from(
            { length: x },
            (_, j) => arr?.[i]?.[j] ?? "."
        )
    );

    table.replaceChildren();
    for (let i = 0; i < y; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < x; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("x", j);
            cell.setAttribute("y", i);
            
            if (arr?.[i]?.[j] !== undefined){
                cell.textContent = arr[i][j];
                map[i] = map[i] || [];
                map[i][j] = arr[i][j];
                
                switch(arr[i][j]){
                    case '>':
                    case '^':
                    case 'v':
                    case '<':
                        if (init) robot.dir = 0;
                        robot.x = j;
                        robot.y = i;
                        cell.classList.add("robot");
                        break;
                    case '.': cell.classList.add("emptyCell"); break;
                    case '#': cell.classList.add("bedrock"); break;
                    case '@': cell.classList.add("gold"); break;
                }
            } else {
                cell.textContent = ".";
                cell.classList.add("emptyCell");
                map[i] = map[i] || [];
                map[i][j] = ".";
            }
            
            cell.addEventListener("click", () => { 
                cell.contentEditable = "true"; 
                window.dispatchEvent(new CustomEvent("cellClicked", { detail: { x: j, y: i } })); 
            });
            
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}


generateTable(15, 10, [[">"]], true);
