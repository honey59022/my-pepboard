const toolsCont=document.querySelector(".tools-cont");
const optionsCont=document.querySelector(".options-cont");


const pencil=document.querySelector(".pencil");
const eraser=document.querySelector(".eraser");

const pencilToolCont=document.querySelector(".pencil-tool-cont");
const eraserToolCont=document.querySelector(".eraser-tool-cont");
let pencilFlag=false;
let eraserFlag=false;

const sticky=document.querySelector(".sticky");
const upload=document.querySelector(".upload");










optionsCont.addEventListener('click',(e)=>{
    const icon=optionsCont.children[0];

    if(icon.classList.contains("fa-bars")){
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        toolsCont.style.display="none";
        pencilToolCont.style.display="none"
        eraserToolCont.style.display="none";
    }
    else{
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        toolsCont.style.display="flex";
    }
})


pencil.addEventListener('click',(e)=>{
    // true -> show pencil tool
    // false -> hide pencil tool

    pencilFlag=!pencilFlag;

    if(pencilFlag)pencilToolCont.style.display="block";
    else pencilToolCont.style.display="none";
    
});


eraser.addEventListener('click',(e)=>{
    // true -> show eraser tool
    // false -> hide eraser tool

    eraserFlag=!eraserFlag;

    if(eraserFlag)eraserToolCont.style.display="flex";
    else eraserToolCont.style.display="none";
});


sticky.addEventListener('click',(e)=>{
  
    
    const stickyTemplateHTML=`
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>
    `;


    createSticky(stickyTemplateHTML);
});


function dragAndDrop(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    
    
    moveAt(event.pageX, event.pageY);
    
    // moves the sticky container at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    // move the sticky container on mousemove
    document.addEventListener('mousemove', onMouseMove);
    
    // drop the sticky container, remove unneeded handlers
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

function noteActions(stickyCont){
    const minimize=stickyCont.querySelector(".minimize");
    const remove=stickyCont.querySelector(".remove");
    
    minimize.addEventListener("click",(e)=>{
        const noteCont=stickyCont.querySelector(".note-cont");
        const display=getComputedStyle(noteCont).display;

        if(display==="none")noteCont.style.display="block";
        else noteCont.style.display="none";
    });
    
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    });

}

function createSticky(stickyTemplateHTML){
    const stickyCont=document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    
    stickyCont.innerHTML=stickyTemplateHTML;

    document.body.appendChild(stickyCont);

    stickyCont.onmousedown=function(event){
        dragAndDrop(stickyCont,event);
    };
    
    stickyCont.ondragstart=function(){
        return false;
    };
    
    noteActions(stickyCont);
}




upload.addEventListener('click',(e)=>{
    // open file explorer
    const input=document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener('change',(e)=>{
        const file=input.files[0];
        const url=URL.createObjectURL(file);

        const stickyTemplateHTML=`
            <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="note-cont">
                <img src="${url}"/>
            </div>
        `;


        createSticky(stickyTemplateHTML);

    })
});