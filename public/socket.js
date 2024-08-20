

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io();

socket.on('message', (data) => {
    const li = document.createElement('li');
    li.textContent = data;
    document.getElementById('messages').appendChild(li);
});

socket.on('roomUsers', ({ room, users }) => {
  // Update the users list when someone joins or leaves the room
  const userList = document.getElementById('userList');
  userList.innerHTML = `
      <ul>
          ${users.map(user => `<li>${user}</li>`).join('')}
      </ul>
  `;
});


const button = document.querySelector('#submit');
button.addEventListener('click',(e)=>{
    e.preventDefault();
  })
button.addEventListener('click', sendMessage);


    
function sendMessage() {
  button.removeEventListener('click', sendMessage);


  var dataObject = {
    name: document.querySelector("#username").innerHTML,
    param1: document.querySelector("#param1").value,
    param2: document.querySelector("#param2").value,
    param3: document.querySelector("#param3").value,
    param4: document.querySelector("#param4").value
}

  socket.emit('message',  dataObject);
  socket.emit("hello", dataObject);

  button.classList.add('btn--clicked');
  button.innerHTML = "";
    
  setTimeout(()=>{
      button.classList.remove("btn--clicked");
      button.innerHTML = "FEED";
      button.addEventListener('click', sendMessage);

    }, 3000);
}



const loginbutton = document.querySelector('#loginbtn');
loginbutton.addEventListener('click',(e)=>{
    e.preventDefault();
    login();
  })

function login(){
console.log("tries to join room", document.querySelector('#username').value);

socket.emit('joinRoom', { username : document.querySelector('#username').value });
}
window.sendMessage = sendMessage;