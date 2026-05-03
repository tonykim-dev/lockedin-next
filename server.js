import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET'  && req.url === '/habits'){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify([]))} // literally should be [] (JSON array) not a string of one
        // i can also do res.end('[]');
    else {
        res.writeHead(404,{'Content-Type':'application/json'});
        res.end(JSON.stringify({
        error: 'endpoint does not exist.',
    }));
    }
});
server.listen(8000);