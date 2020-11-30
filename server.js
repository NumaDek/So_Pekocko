//const https = require('https');
const http = require('http');
const app = require('./app');
//const fs = require('fs');

app.set('port', process.env.PORT || 3000);

//const options = {
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem')
//};

//const server = https.createServer(options, app);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);