const canvas=document.querySelector("canvas");
const pencilColor=document.querySelectorAll(".pencil-color");
const pencilWidthElem=document.querySelector(".pencil-width");
const eraserWidthElem=document.querySelector(".eraser-width");
const download=document.querySelector(".download");
const redo=document.querySelector(".redo");
const undo=document.querySelector(".undo");








canvas.height=window.innerHeight;
canvas.width=window.innerWidth;


let penColor="red";
const eraserColor="white";
let penWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;

let undoRedoTracker=[]; // data
let track=0; // Represent which action from tracker array


let mouseDown=false;




//API
const tool=canvas.getContext("2d");

tool.strokeStyle=penColor;
tool.lineWidth=penWidth;

/*
tool.beginPath(); // new graphic (path) line
tool.moveTo(10,10); // start point
tool.lineTo(100,100); // end point
tool.strokeStyle='red'; // use for different line color
tool.stroke();  // use to fill color
tool.lineWidth=5; // width of the line
*/








// mousedown -> start new path
// mousemove -> path fill (graphics)
// mouseup   -> mousedown=false 
canvas.addEventListener('mousedown',(e)=>{
    if(undoRedoTracker.length==0){ // for the entry of clear canvas
        const url=canvas.toDataURL();
        undoRedoTracker.push(url);
        track=undoRedoTracker.length-1;
    }

    mouseDown=true;
    // beginPath({
    //     x:e.clientX,
    //     y:e.clientY
    // });

    const data={
        x:e.clientX,
        y:e.clientY
    }

    // send data to server
    socket.emit("beginPath",data);
    
});
canvas.addEventListener('mousemove',(e)=>{
    if(mouseDown){
        // drawStroke({
        //     x:e.clientX,
        //     y:e.clientY,
        //     color:eraserFlag?eraserColor:penColor,
        //     width:eraserFlag?eraserWidth:penWidth
        // });

        const data={
            x:e.clientX,
            y:e.clientY,
            color:eraserFlag?eraserColor:penColor,
            width:eraserFlag?eraserWidth:penWidth
        }
        
        // send data to server
        socket.emit("drawStroke",data);
    }
});
canvas.addEventListener('mouseup',(e)=>{
    mouseDown=false;


    const url=canvas.toDataURL();
    undoRedoTracker.push(url);
    track=undoRedoTracker.length-1;
});



function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}



// pencil and eraser
pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        const color=colorElem.classList[0];
        penColor=color;
        tool.strokeStyle=penColor;
    });
})

pencilWidthElem.addEventListener('change',(e)=>{
    penWidth=pencilWidthElem.value;
    tool.lineWidth=penWidth;
});

eraserWidthElem.addEventListener('change',(e)=>{
    eraserWidth=eraserWidthElem.value;
    tool.lineWidth=eraserWidth;
});

eraser.addEventListener('click',(e)=>{
    if(eraserFlag){
        tool.strokeStyle=eraserColor;
        tool.lineWidth=eraserWidth;
    }
    else{
        tool.strokeStyle=penColor;
        tool.lineWidth=penWidth;
    }
});





//download 
download.addEventListener("click",(e)=>{
    const url=canvas.toDataURL();

    const a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})


//undo 
undo.addEventListener('click',(e)=>{
    if(track>0)track--;
    
    const trackObj={
        trackValue:track,
        undoRedoTracker
    }
    socket.emit("redoUndo",trackObj);
    // undoRedoCanvas(trackObj);

});


//redo
redo.addEventListener('click',(e)=>{
    if(track<undoRedoTracker.length-1)track++;

    const trackObj={
        trackValue:track,
        undoRedoTracker
    }
    socket.emit("redoUndo",trackObj);
    // undoRedoCanvas(trackObj);
})


function undoRedoCanvas(trackObj){
    track=trackObj.trackValue;
    undoRedoTracker=trackObj.undoRedoTracker;

    const url=undoRedoTracker[track];
    
    
    const img=new Image(canvas.width,canvas.height);  // new Image refrence element
    img.src=url;

    // first we need to clear the canvas and then upload the just previous or next data
    tool.clearRect(0, 0, canvas.width, canvas.height);

    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);    
    }
}




socket.on("beginPath",(data)=>{
    // data -> data from server
    beginPath(data);
});



socket.on("drawStroke",(data)=>{
    // data -> data from server
    drawStroke(data);
});


socket.on("redoUndo",(data)=>{
    // data -> data from server
    undoRedoCanvas(data);
})

