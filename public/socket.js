

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


socket.on('gameSaysConsent', (data) => {

  console.log("game says consent");

 button.style.display = "block";
 document.getElementById('sliders').style.display = "flex";
 document.getElementById('errorMsg').style.display = "none";



});
socket.on('gameSaysDisConsent', (data) => {

  console.log("game says disconsent");

  button.style.display = "none";
  document.getElementById('sliders').style.display = "none";
  document.getElementById('errorMsg').style.display = "block";
 
 });

socket.on('block', (data) => {
  console.log("running an emperativ", data);
  tempDismantleButton();
});

socket.on('roomUsers', ({ room, users }) => {
  // Update the users list when someone joins or leaves the room
  const userList = document.getElementById('userList');
  let htmlString = `<ul>`;

  // for (let index = 0; index < 100; index++) { 
  //   addUsers();
  // }

  addUsers();

  function addUsers(){
    users.forEach(user => {
      console.log(user);
      htmlString += `<li><p>${user.username}</br>_<i>online</i>_</p> `
      if(user.data){
        let total = user.data.momenergy + user.data.gayenergy + user.data.domenergy + user.data.directorenergy;
        let param1perc = user.data.momenergy/ (total/100);
        let param2perc = user.data.gayenergy/ (total/100);
        let param3perc = user.data.domenergy/ (total/100);
        let param4perc = user.data.directorenergy/ (total/100);
        htmlString += `<p><i>commands: ${user.data?.orderamount}</i></p>
        <div class="pie" style="background-image: conic-gradient(#d21526 0, #d21526 ${param1perc}%, black 0, black ${param3perc + param1perc}%, #ff00ec 0, #ff00ec ${param2perc + param3perc + param1perc}%, #00ffe8 0, #00ffe8 100%)"></div></li>`;
      } else{
        htmlString += `</li>` 
      }
  
    });
  }

  htmlString += `</ul>`;

  userList.innerHTML = htmlString;
});




function tempDismantleButton(){
  button.removeEventListener('click', sendMessage);

  button.classList.add('btn--clicked');
  button.innerHTML = "";
  setTimeout(()=>{
    button.classList.remove("btn--clicked");
    button.innerHTML = "FEED";
    button.addEventListener('click', sendMessage);

  }, 13000);
    
}

    
function sendMessage() {


  tempDismantleButton();

  var dataObject = {
    name: document.querySelector("#name")?.innerHTML,
    param1: document.querySelector("#param1").value,
    param2: document.querySelector("#param2").value,
    param3: document.querySelector("#param3").value,
    param4: document.querySelector("#param4").value
}

  socket.emit('message',  dataObject);
  socket.emit("hello", dataObject);


}



const loginbutton = document.querySelector('#loginbtn');

if(loginbutton){
  loginbutton.addEventListener('click',(e)=>{
    login(document.querySelector('#username').value);
  })
}


function login(name){
  console.log("tries to join room", name, socket.name);
  socket.emit('joinRoom', { username : name });
}

window.onload = (event) => {
  console.log("window on load", document.querySelector("#name"),document.querySelector("#name").innerHTML, loginbutton );
  
  if(!loginbutton && document.querySelector("#name")){
    login(document.querySelector("#name").innerHTML);
  }
};


const secretbutton = document.querySelector("#sharebtn");
if(secretbutton){
  secretbutton.addEventListener('click',(e)=>{
    document.querySelector('#secretform').style.display = "none";
    document.querySelector('#secretthanku').style.display = "block";
  })
}

window.sendMessage = sendMessage;