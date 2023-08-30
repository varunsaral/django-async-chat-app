const messageLog = document.getElementById('chat-log');
const messageInput = document.getElementById('chat-message-input');
const messageSubmit = document.getElementById('chat-message-submit');

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent line break
        messageSubmit.click();  // Simulate "Send" button click
    }
});

messageSubmit.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        messageInput.value = '';
        chatSocket.send(JSON.stringify({
            'type': 'message',
            'message': message
        }));
    }
});

function appendMessage(message) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.textContent = message;
    messageLog.appendChild(messageBubble);
    messageLog.scrollTop = messageLog.scrollHeight;
}

const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message = data.message;
    appendMessage(message);
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};