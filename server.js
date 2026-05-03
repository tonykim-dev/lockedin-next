import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        data: 'Hello World!',
    }));
});
server.listen(8000);