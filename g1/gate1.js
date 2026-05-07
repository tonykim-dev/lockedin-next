import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req,res) => {
    if (req.method === "GET" && req.url === "/habits"){
        const habits = fs.readFile('habits.json','utf-8');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(habits));
        return;
    }
    res.end();
});
server.listen(3000);