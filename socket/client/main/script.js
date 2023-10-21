
const socket = io();

socket.on("connect", ()=>{
    console.log("connected");
    const url = "http://localhost:4000/convo";
    fetch(url, {method: "GET"})
    .then((response)=>{
        return response.json();
    })
    .then((data) =>{
        data.forEach((item)=>{
            const li = document.createElement("LI");
            li.classList.add(`bot__output`);
            li.classList.add(`bot__output--standard`);
    
            li.textContent = item.message_text;

            document.querySelector("#chatlist").appendChild(li);
        });
    })
});
        
socket.on("chat", (messageObj)=>{

    const li = document.createElement("LI");
    li.classList.add(`bot__output`);
    li.classList.add(`bot__output--standard`);
    
    li.textContent = messageObj.message_text;

    document.querySelector("#chatlist").appendChild(li);

    console.log(messageObj);

});

const li = `<li class="bot__output bot__output--standard">Hey, I'm Navvy!</li>`;

const chatBox = document.querySelector("#chatbox");
const sendBtn = document.querySelector("#sendbtn");

chatBox.addEventListener("keydown", handleSend);
sendBtn.addEventListener("click", handleClick);

function handleSend(e){

    
    
}

function handleClick(e){
    e.preventDefault();

    const { user_id, user_name } = JSON.parse(localStorage.getItem("user"));



    const chatBoxContent = document.querySelector("#chatbox").value;

    console.log(chatBoxContent);

    const messageObj = {
        user_id: user_id,
        user_name: user_name,
        message_text: chatBoxContent
    }

    socket.emit("chat", messageObj);
}




