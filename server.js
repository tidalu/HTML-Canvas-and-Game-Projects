const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
  const currentDirectory = __dirname;
  const requestedPath = path.join(currentDirectory, req.url);

  // Check if the requested path is a directory
  if (fs.statSync(requestedPath).isDirectory()) {
    // If it's a directory, list its contents
    const directoryContents = fs.readdirSync(requestedPath);
    const fileList = directoryContents
      .map((item) => {
        const itemPath = path.join(req.url, item);
        return `<li><a href="${itemPath}">${item}</a></li>`;
      })
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${req.url}</title>
        </head>
        <body>
          <h1>${req.url}</h1>
          <ul>${fileList}</ul>
        </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else {
    // If it's a file, serve it
    fs.readFile(requestedPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
