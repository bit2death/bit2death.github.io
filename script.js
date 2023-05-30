"use strict";
async function getJsonDemos(){
    const response = await fetch("./demos/demos.json").
    catch(e => {
        console.log(e)
    });
    const jsonData = await response.json();
    await jsonData.forEach(e => {
        createProjItem(e)
    })
}

window.onload = function(){
    getJsonDemos()
}

function createProjItem(data){
    let cont = document.createElement("div");
    cont.classList.add("proj")
    if(data.href != ""){
        cont.addEventListener("mousedown", function(){
            setTimeout(
            function(){if(confirm("This will open in another tab\nclick OK to proceed")){;
                window.open(data.href, "_blank")}}, 200
            )
        });
    }

    let title = document.createElement("h3");
    if(data.name != ""){
        title.innerHTML = data.name;
    }else{
        title.innerHTML = "nameMissing";
    }
    cont.appendChild(title);


    
    let canvas = document.createElement("canvas");
    canvas.classList.add("projImg");
    cont.appendChild(canvas);
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = "Images/placeholder.png";
    img.onload = function() {
        if(data.src != "" || data.src == null){
            img.src = data.src;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0)
    }
    document.querySelector("#projects").appendChild(cont);

}

function openTab(e, tab){
    document.querySelector("#tabBar").querySelectorAll(".active").forEach(e => {e.classList.remove("active")})
    e.target.classList.add("active");
    document.querySelectorAll(".tab").forEach(e => {e.style.display = "none"})
    document.getElementById(tab).style.display = "flex";
}