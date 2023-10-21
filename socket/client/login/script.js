

const registerBtn = document.querySelector("#loginbtn");

registerBtn.addEventListener("click", handleLogin);



function handleLogin(e){

    e.preventDefault();

    const user_email = document.querySelector("#user_email").value;

    const user_password = document.querySelector("#user_password").value;

    const userObj = {
       
        user_email: user_email,
        user_password: user_password
    };

    sendData(userObj);
}

function sendData(userObj){

    const url = "http://localhost:4000/login";
    const options = {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    fetch(url, options)
    .then((response) =>{
        return response.json();
    })
    .then((data) =>{
       
        if(data.codeNumber == 1){

            const {user_id, user_name } = data.message[0];

            console.log(data);

            localStorage.setItem("user",JSON.stringify({user_id: user_id, user_name: user_name}));

            window.location.replace("http://localhost:4000/main");
        }
        else{
            alert(data.message);
        }
    
    });
}