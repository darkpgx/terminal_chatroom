##NULLCHAT

Communicate with fellow programmers on the terminal!!! 
Nullchat is a simple and easy to use chat app based on the terminal.

##REQUIREMENTS

If haven't done so, please install npm and node.js on your terminal.
You can visit the official instruction guides on the link below.

[node.js - Instructions](https://github.com/joyent/node/wiki/Installation)
[npm - Instructions](https://github.com/npm/npm)

##INSTALLATION

Once node.js and npm is installed in terminal, you can download nullchat using npm
-Type "npm install nullchat" to download Nullchat
-Locate your Nullchat directory; it should be in the path given by: "npm root"
-Change directory to the given path for Nullchat (cd ~/PATH/FOR/NULLCHAT)
-Once in the nullchat directory, type:
   
   -sudo npm install -g (for global installatioin, which allows you use nullchat from any directory)
   -npm install (for local installation, which can only be accessed from inside the nullchat directory)

##GET STARTED and BASICS

After installing nullchat and its dependencies, you can start chatting on the terminal.
Start nullchat by simply typing "nullchat."
  1. This will prompt the user to enter roomname.

    -Type "exit" to end nullchat
    -Type "/listroom" to list all the available rooms
    -Type existing or new roomname to enter or create a chat room

  2. Then the user will be prompted to enter the password.

    -Type "exit" to end nullchat
    -If the room is public, enter by ommiting the password(simply hit enter or return when prompted)
    -If the room is not public, a password is required, which can be obtained from the user who created the roomname
    -If you have created the room (you do this by entering a roomname that does not exist in /listroom", \
    you can choose to make it public by ommiting the password or not public by entering a password

  3. Choose a username when prompted

    -Type "exit" to end nullchat
    -Enter a desired username to check for availability.
    -If the username is not available, a message will show and ask you to choose a different username
    -If the user name is available, a message will notify you that you have joined the roomname
    
  4. Start chatting
  
    -Once in the room chat messages sent by other users will appear on your console
    -Hit return or enter once to enter chatmode
    -Chat mode stops incoming chat messages while you type your message
    -In chat mode, type "exit" to end nullchat
    -In chat mode, type "/list" to see all the users that are currently in the roomname
    -In chat mode, type your message and hit enter or return to send it to all other users currently in the room

  5. Chat with fellow programmers and friends using terminal and enjoy the simplicity of nullchat!!!


