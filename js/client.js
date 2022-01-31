const socket = io('http://localhost:8000');

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messaging');
const messageContainer = document.querySelector(".container");

// Audio that will play on recevving messages
const audio = new Audio('noti.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
};

// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// If a new user joins receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
});

// If server sends a message recieve it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

// If a user leaves the chat let other people know
socket.on('left', name =>{
    append(`${name} left the chat`, 'right');
});

// If the form gets submitted sendserver the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});