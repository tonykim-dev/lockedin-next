import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req, res) => {

    const text = await fs.readFile('habits.json','utf-8');
    const habits = JSON.parse(text);
    // console.log(habits); log if needed

    const nextId = habits.length === 0 ? 1 : Math.max(...habits.map(h => h.id)) + 1;

    if (req.method === 'GET'  && req.url === '/habits'){

        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(habits))}

    else if (req.method === 'POST' && req.url === '/habits'){
        let body = '';
        req.on('data', chunk => body +=chunk);
        req.on('end', async () => {
            const parsed = JSON.parse(body);
            const newHabit = {id: nextId, name: parsed.name};
            habits.push(newHabit);
            await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(newHabit));
        });
    }
    else{
        res.writeHead(404,{'Content-Type':'application/json'});
        res.end(JSON.stringify({
        error: 'endpoint does not exist.',
    }));
    }
});
server.listen(8000);