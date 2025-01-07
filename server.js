require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require('path');
const PORT = 3000;

const MIME_TYPE = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    
    const contentType = MIME_TYPE[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile('./404.html', (error, page404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(page404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/\nAPI Key: ${process.env.API_KEY}`);
});
