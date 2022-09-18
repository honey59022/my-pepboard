//Access
const express=require("express"); 
const socket=require("socket.io");


// Initialize and server ready
const app=express();  

app.use(express.static("public"))

const port=process.env.PORT || 5000;
const server=app.listen(port,()=>{
    console.log("listening to port "+port);
});



const io=socket(server);

io.on("connection",(socket)=>{
    console.log("Made socket connection");

    // Recieved Data
    socket.on("beginPath",(data)=>{
        // data -> recieved data from frontend
        // Now transfer data to all connected computers including my computer
        io.sockets.emit("beginPath",data);

    });


    socket.on("drawStroke",(data)=>{
        // data -> recieved data from frontend
        // Now transfer data to all connected computers including my computer
        io.sockets.emit("drawStroke",data);

    });

    socket.on("redoUndo",(data)=>{
        // data -> recieved data from frontend
        // Now transfer data to all connected computers including my computer
        io.sockets.emit("redoUndo",data);

    });

})