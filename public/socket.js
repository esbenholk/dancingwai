

import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";


      
const sio = io();


const button = document.querySelector('.btn');
button.addEventListener('click',(e)=>{
    e.preventDefault();
    button.classList.add('btn--clicked');
            

            
    sio.emit("hello", "emitting to socket from browser");
   
            
      
      setTimeout(()=>{button.classList.remove("btn--clicked")}, 15000);
      // setTimeout(()=>{document.querySelector('.thanku').style.display = "none"},15500);

   
      // setTimeout(()=>{document.querySelectorAll('span').forEach((element)=>{element.classList.remove('expanded')})},14000)});

      function submit(){
            let text = document.getElementById("name").value;
            if(text == null  || text == ""){
                text = "[default user]";
            }
            sio.emit("hello", text);
      }
    });

    document.getElementById("submit").addEventListener('click', submit);
		
		window.onload = function () {

      console.log("window loads actions")
			sio.on('connect', () => {
        console.log("connecting in browser");
        
				sio.emit('KnockKnock');
			});

      sio.on('hello', () => {
				sio.emit('KnockKnock');
			});
			
	
		}


