# Async Django Chat Application

This is an asynchronous chat application built with Django and Django Channels. It allows multiple users to join a room and chat in real-time. The application also includes a feature to search and play music from YouTube.

## Features

1. **Real-time chat:** Users can join a chat room and send messages in real-time.

2. **YouTube integration:** Users can search for music on YouTube and play it directly in the chat room. The application uses the pytube library to search for YouTube videos and download the audio.

3. **Special commands:** Users can use special commands to interact with the YouTube feature. For example, `!search <query>` to search for music and `!play <index>` to play a specific result.

## Running the Application Locally

To run the application locally, you need to install the required Python packages and start the Django server. Here are the steps:

1. Install the required Python packages:


2. Start the Django server:


Replace `ip:port` with the IP address and port where you want to run the server.

## Code Structure

The application is structured into several Python scripts and HTML templates:

- `manage.py`: The main script to run administrative tasks.

- `chat_app/views.py`: Contains the views for the chat application.

- `chat_app/consumers.py`: Contains the WebSocket consumer for handling real-time chat.

- `chat_app/models.py`: Contains the Django models for the chat application.

- `chat_app/tests.py`: Contains the tests for the chat application.

- `chat_app/urls.py`: Contains the URL configurations for the chat application.

- `chat_app/routing.py`: Contains the WebSocket routing configurations.

- `chat_project/settings.py`: Contains the settings for the Django project.

- `chat_project/urls.py`: Contains the main URL configurations for the Django project.

- `chat_project/asgi.py`: Contains the ASGI application for Django Channels.

- `chat_project/wsgi.py`: Contains the WSGI application for Django.

- `templates/chat_app/index.html`: The main page where users can enter a chat room.

- `templates/chat_app/room.html`: The chat room page where users can send messages.

- `templates/chat_app/music.html`: The page for searching and playing music from YouTube.

- `static/chat_app/js/chat.js`: Contains the JavaScript code for handling chat messages.

- `static/chat_app/js/music.js`: Contains the JavaScript code for handling YouTube search and playback.

- `static/chat_app/css/chat.css`: Contains the CSS styles for the chat application.

## Dependencies

The application uses several Python packages, including Django, Django Channels, and pytube. You can find the full list of dependencies in the `requirements.txt` file.
