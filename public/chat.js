// this file serves as the Client, which connects to the server
// this script is loaded in the index.html file, which forms the interface between the Client and the Server
// technically, this file (chat.js) and the index.html serve as the frontend of the app

// define Client socket and connect to the Server (at port# 4000)
var clientSocket = io.connect('http://localhost:4000');
//alert('Hi');     // DEBUGGING
window.onload = function(){
    // working with the message
    // creating references to DOM elements
    var chat_body = document.getElementById('chat-body');
    var message = document.getElementById('message');
    var send_button = document.getElementById('send');

    // Adding event to send message
    send_button.addEventListener('click', function(){
        // creating div element to contain user image and user message
        var user_chat = document.createElement('div');
        user_chat.classList.add('chat');
        user_chat.classList.add('self');
        // creating div element to contain user image
        var user_img_div = document.createElement('div');
        user_img_div.classList.add('user-photo');
        var user_image = document.createElement('img');
        user_image.src = 'images/user-small.png';
        user_img_div.appendChild(user_image);
        // creating element for user message
        var user_message = document.createElement('p');
        user_message.classList.add('chat-message');

        // displaying user's message
        user_message.innerHTML = message.value;
        user_chat.appendChild(user_img_div);
        user_chat.appendChild(user_message);
        chat_body.appendChild(user_chat);       

        // emit method takes two parameters: event name, and data to be sent
         /* the name chat-message is user-defined and is implemented 
        as an event below so that the Client could also respond to the Server. */
        //alert('hii');
        clientSocket.emit('chat-message', {message: message.value, handle: ''});
       
        message.value = "";      // resetting message input field
        //alert('sent');     // DEBUGING
    });

    // RESPONDING TO SERVER'S MESSAGES
    clientSocket.on('chat-message', function(data){
        // creating message elements for bot message (similar to user message)
         // creating div element to contain bot image and bot message
         var bot_chat = document.createElement('div');
         bot_chat.classList.add('chat');
         bot_chat.classList.add('friend');
         // creating div element to contain bot image
         var bot_img_div = document.createElement('div');
         bot_img_div.classList.add('user-photo');
         var bot_image = document.createElement('img');
         bot_image.src = 'images/drlecter-small.png';
         bot_img_div.appendChild(bot_image);
         // creating element for bot message
         var bot_message = document.createElement('p');
         bot_message.classList.add('chat-message');
 
         // displaying bot's message
         bot_message.innerHTML = data;
         bot_chat.appendChild(bot_img_div);
         bot_chat.appendChild(bot_message);
         chat_body.appendChild(bot_chat);
 
        //alert('server message: ', data.message);      // DEBUGGING

    });

}




