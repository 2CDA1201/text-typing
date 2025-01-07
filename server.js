require("dotenv").config();
const http = require("http");
const fs = require("fs");
const PORT = 3000;
const html = fs.readFileSync("./index.html");

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(html);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/\nAPI Key: ${process.env.API_KEY}`);
});
