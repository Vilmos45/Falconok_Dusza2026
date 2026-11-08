const rangGomb = document.getElementById("ranglistaButton");
const rang = document.getElementById("ranglista");

let shown = false;

rangGomb.addEventListener("click", () => {
    if (shown){
        rang.style.display = "none";
    }else{
        rang.style.display = "block";
    }
});