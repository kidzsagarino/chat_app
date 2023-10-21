const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const mysql = require("mysql2");

const con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database:"chat_db"

});

app.use(express.static("client"));

app.use(express.json());

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/client/login/index.html");
});

app.get("/main", (req, res) =>{
    res.sendFile(__dirname + "/client/main/index.html");
});


app.get("/convo", (req, res) =>{
    const sql = "SELECT user_id, message_text FROM message";

    con.query(sql, (err, result) =>{
        if(!err){
            return res.status(200).json(result);
        }

        return res.status(500).json({message: "Server Error"});

    });
});

app.get("/login", (req, res) =>{
    res.sendFile(__dirname + "/client/login.html");
});

app.post("/login", (req, res) =>{

    const { user_email, user_password } = req.body;

    const sql = "SELECT user_id, user_name FROM user WHERE user_email = ? AND user_password = ?";

    con.query(sql, [user_email, user_password], (err, result) =>{

        console.log(result);

        if(!err){
            if(result.length > 0){
                return res.status(200).json({message: result, codeNumber: 1});
            }

            return res.status(200).json({message: "Invalid username or password", codeNumber: 0});
        }

        return res.status(500).json({message: "Server Error"});
    });

});


app.get("/register", (req, res) =>{
    res.sendFile(__dirname + "/client/register.html");
});


app.post("/register", (req, res) =>{

    const { user_name, user_email, user_password } = req.body;

    const sql = "INSERT INTO user(user_name, user_email, user_password) VALUES(?, ?, ?)";

    con.query(sql, [user_name, user_email, user_password], (err, result) =>{

        if(!err){
            return res.status(200).json({message: "Registered successfully"});
        }

        return res.status(500).json({message: "Server error"});

    });

});

io.on("connection", (socket) =>{

    console.log("connected");

    socket.on("chat", (messageObj) =>{

        const { user_id, message_text } = messageObj;

        console.log(messageObj);

        const sql = "INSERT INTO message(user_id, message_text) VALUES(?, ?)";

        con.query(sql, [user_id, message_text], (err, result)=>{
            
            if(!err){
                io.emit("chat", messageObj);
            }
            else{
                io.emit("chat", {user_id: 0, message_text: "Server Error"});
            }
            
        });

    
    });

    socket.on("disconnect", ()=>{
        console.log("disconnected");


    });


});


server.listen(4000, () =>{
    console.log("Server listening on PORT 4000");
});


