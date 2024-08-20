

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
          ${users.map(user => `<p>${user.username}__<i>online</i>____${user.data.param1}</p>`).join('')} 
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
    name: document.querySelector("#name").innerHTML,
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

if(loginbutton){
  loginbutton.addEventListener('click',(e)=>{
    login(document.querySelector('#username').value);
  })
}


function login(name){
  console.log("tries to join room", name);
  socket.emit('joinRoom', { username : name });
}

window.onload = (event) => {
  if(!loginbutton && document.querySelector("#name")){
    login(document.querySelector("#name").innerHTML);
  }
};

window.sendMessage = sendMessage;