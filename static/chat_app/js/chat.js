const messageLog = document.getElementById('chat-log');
const messageInput = document.getElementById('chat-message-input');
const messageSubmit = document.getElementById('chat-message-submit');
var sound = null

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

function displaySearchResults(results) {
   
}

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type == 'special_command_search') {
        // Display search results as clickable cards
        data.message.forEach((result, index) => {
            console.log(result)
            const message = `${index + 1}. ${result.title}`;
            appendMessage(message);
        });
        // displaySearchResults(data.message);
     } 
     else if (data.type == 'special_command_play'){
            video_id = data.message
            if (sound) {
                sound.stop();
            }
            // Call the download endpoint to download audio from YouTube video
            fetch(`/download/${encodeURIComponent(video_id)}`)
                .then((response) => response.json())
                .then((data) => {
                    var audioFile = data.audio_path;
                    // Create a Howl instance
                    sound = new Howl({
                        src: [audioFile],
                        html5: true
                    });
                    sound.play();
    
                    //clearing the search results 
                    const searchResultsContainer = document.getElementById("search-results");
                    searchResultsContainer.innerHTML = "";
                    //clearing the search query box
                    searchQueryBox.value = "";
                })
                .catch((error) => console.error("Error downloading audio:", error));
            
     }
    else{
    const message = data.message;
    appendMessage(message);
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};