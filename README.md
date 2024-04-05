# Frontends for chat application
Both Web and Mobile frontends are integrated within the same codebase to maintain consistency.  They communicate with a server via websockets.  

# Web
Web client uses React.js.  
To start working with it, navigate to its root folder twin_front/web  
`cd web`  
Install dependencies  
`npm install`  
Start the application  
`npm start`  
Follow README in web folder.  

# Mobile
Mobile client uses React Native.  
To start working with it, navigate to its root folder twin_front/web  
`cd mobile`  
Install dependencies  
`npm install`  
For local development, adjust IP address of a server in mobile/src/core/services/ws/ws_api.ts  
Insert IP4 of your local machine to here:  
`let socketUrl = 'http://10.0.0.112:5000';`  
Start the application    
`npm start`  
Follow README in mobile folder.  

# Server
Test server is located in repo 'twin_web_backend', though it works for for both Web and Mobile clients.  Itt's written on Python.  
Run src/api/app.py    
It will start web client on localhost:5000  

