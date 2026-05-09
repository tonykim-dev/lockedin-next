import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req,res) => {
    if (req.method === "GET" && req.url === "/habits"){
        const habits = await fs.readFile('habits.json','utf-8');
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(habits));
        return;
    }
    else if (req.method === 'POST' && req.url === '/habits'){
        let habits = fs.readFile('habits.json','utf-8');
        let body = '';
        req.on('data', (chunk) => {body+=chunk;});
        req.on('end',async ()  => {
            habits = fs.readFile('habits.json','utf-8');
            let id = 0;
            if (Object.keys(habits).length === 0){
                id = 1;
            }
            else{
                id = Object.keys(habits).length+1;
            }
            let parsedBody = JSON.parse(body);
            let habit = {"id": id, "name": parsedBody.name, "done": false};
            habits = {...habits,habit};
            if (id == 1) {
                await fs.writeFile('habits.json',JSON.stringify(habits));
            }
            else {
                await fs.writeFile('habits.json',JSON.stringify(habits) + '\n', { flag: 'a'});
            }
        });
        res.writeHead(201, {'Content-Type':'application/json'});
        console.log(habits);
        res.end(JSON.stringify(habits));
    }
    else{
        console.log('no')
        res.end();
    }
});
server.listen(3000);