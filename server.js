import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req, res) => {

    const text = await fs.readFile('habits.json','utf-8');
    const habits = JSON.parse(text);
    const nextId = habits.length === 0 ? 1 : Math.max(...habits.map(h => h.id)) + 1;
    const parts = req.url.split('/').filter(f => f);

    if (req.method === 'GET'  && req.url === '/habits'){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify(habits));
        }

    else if (req.method === 'POST' && req.url === '/habits'){
        let body = '';
        req.on('data', chunk => body +=chunk);
        req.on('end', async () => {
            const parsed = JSON.parse(body);
            const newHabit = {id: nextId, name: parsed.name, complete: false};
            habits.push(newHabit);
            await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(newHabit));
        });
    }
    
    else if (req.method === 'POST' && parts[0] === 'habits' && parts.length === 3 && parts[2] === 'complete'){
        const id = Number(parts[1]);
        const targetHabit = habits.find(h => h.id === id);
        if (!targetHabit){
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({error: 'targetHabit does not exist.'}));
            return;
        }
        targetHabit.complete = true;
        await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(habits));
    }
    else if (req.method === 'DELETE' && parts[0] === 'habits' && parts.length === 2){
        const id = Number(parts[1]);
        const targetHabitIndex = habits.findIndex(h => h.id === id);
        if (targetHabitIndex === -1) {
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({error: 'targetHabit does not exist.'}));
            return;
        }
        habits.splice(targetHabitIndex,1);
        await fs.writeFile('habits.json', JSON.stringify(habits, null, 2));
        res.writeHead(204, {'Content-Type': 'application/json'});
        res.end();
    }
    else{
        res.writeHead(405,{'Content-Type':'application/json'});
        res.end(JSON.stringify({
        error: 'Request does not exist or not allowed.',
    }));
    }
});
server.listen(3000);