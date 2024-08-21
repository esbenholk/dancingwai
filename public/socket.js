

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
    htmlString += `<p>${user.username}</br>_<i>online</i>_</p> `
    if(user.data){
      let total = user.data.momenergy + user.data.gayenergy + user.data.domenergy + user.data.directorenergy;
      let param1perc = 360/100 * (user.data.momenergy/ (total/100));
      let param2perc = 360/100 * (user.data.gayenergy/ (total/100));
      let param3perc = 360/100 * (user.data.domenergy/ (total/100));
      let param4perc = 360/100 * (user.data.directorenergy/ (total/100));
      htmlString += `<div><p>${user.data?.orderamount}</p>
      <div class="pie" style="background-image: conic-gradient(#d21526 ${param1perc}deg, #ff00ec 0 ${param2perc}deg, black 0${param3perc}deg, #00ffe8 0 )"></div></div>`;
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