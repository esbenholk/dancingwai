function updateTextInput(val, id) {
    document.getElementById(id).innerHTML=val + "%"; 
  }


  function sendMessage() {
    const input = document.getElementById('messageInput');
    socket.emit('message', input.value);
    input.value = '';
  }
