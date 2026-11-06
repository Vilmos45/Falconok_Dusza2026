function generateTable(){
for (let i = 0; i < 15; i++) {//1-15, 1-15
        let row = '<div class = "row">';
        for (let j = 0; j < 15; j++) {
            row += '<div class="cell"></div>';
        }
        row += "</div>";
        document.getElementById("table").innerHTML += row;
    }
    console.log("...");
}


generateTable();

    console.log("set");