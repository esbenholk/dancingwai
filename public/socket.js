

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

socket.on('message', (data) => {
    const li = document.createElement('li');
    li.textContent = data;
    document.getElementById('messages').appendChild(li);
});


const button = document.querySelector('#submit');
button.addEventListener('click',(e)=>{
    e.preventDefault();
  })
button.addEventListener('click', sendMessage);


    
function sendMessage() {
  button.removeEventListener('click', sendMessage);

  const param1 = document.querySelector("#param1");
  const param2 = document.querySelector("#param2");
  const param3 = document.querySelector("#param3");
  const param4 = document.querySelector("#param4");

    socket.emit('message',  param1,param2,param3,param4);
    socket.emit("hello", param1.value,param2.value,param3.value,param4.value);

    button.classList.add('btn--clicked');
    button.innerHTML = "";
    
    setTimeout(()=>{
      button.classList.remove("btn--clicked");
      button.innerHTML = "FEED";
      button.addEventListener('click', sendMessage);

    }, 3000);
}

window.sendMessage = sendMessage;