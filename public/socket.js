

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
  let htmlString = `<ul>`;

  users.forEach(user => {
    console.log(user);
    htmlString += `<p>${user.username}</p>`
    if(user.data){
      let total = user.data.momenergy + user.data.gayenergy + user.data.domenergy + user.data.directorenergy;
      let param1perc = user.data.momenergy/ (total/100);
      let param2perc = user.data.gayenergy/ (total/100);
      let param3perc = user.data.domenergy/ (total/100);
      let param4perc = user.data.directorenergy/ (total/100);
      htmlString += `<p>_<i>online</i><br>_commands:${user.data?.orderamount}</p>
      <div class="pie" style="background-image: conic-gradient(#d21526 ${param1perc}%, #ff00ec ${param2perc}%, black ${param3perc}%, #00ffe8 ${param4perc}%)"></div>`;
    }

  });

  htmlString += `</ul>`;

  userList.innerHTML = htmlString;
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