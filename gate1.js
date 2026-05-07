import http from 'node:http';
import fs from 'node:fs/promises';

const server = http.createServer(async (req,res) => {
    const parts = req.url.split('/').filter(Boolean);
    if (req.method === 'GET' && req.url === '/habits') {
        const habits = await fs.readFile('habits.json','utf-8');
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(habits);
    }
    else if (req.method === 'POST' && req.url === '/habits'){
        let body = '';
        req.on('data',chunk => body+=chunk);
        req.on('end', async () => {
            try {
                const parsed = JSON.parse(body);
                const text = await fs.readFile('habits.json','utf-8');
                const habits = JSON.parse(text);
                const nextId = habits.length === 0 ? 1 : Math.max(...habits.map(h => h.id)) + 1;
                const newHabit = { id: nextId, name: parsed.name, done: false};
                habits.push(newHabit);
                res.writeHead(201, {'Content-Type':'application/json'});
                await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
                res.end(JSON.stringify(newHabit));
            }
            catch (e) {
                res.writeHead(400, {'Content-Type':'application/json'});
                res.end(JSON.stringify({error: 'invalid JSON'}));
            }
        });
    }
    else if (req.method === 'POST' && parts[0] === 'habits' && parts.length === 3 && parts[2] === 'done'){
        const id = Number(parts[1]);
        const text = await fs.readFile('habits.json','utf-8');
        const habits = JSON.parse(text);
        const habit = habits.find(h=>h.id===id);
        if (!habit){
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({error:'habit not found'}));
            return;
        }
        habit.done = true;
        res.writeHead(200, {'Content-Type':'application/json'});
        await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
        res.end(JSON.stringify(habit));
    }
    else if (req.method === 'DELETE' && parts.length === 2 && parts[0] === 'habits'){
        const id = Number(parts[1]);
        const text = await fs.readFile('habits.json','utf-8');
        const habits = JSON.parse(text);
        const index = habits.findIndex(h=>h.id===id);
        if (index === -1){
            res.writeHead(404, {'Content-Type':'application/json'});
            res.end(JSON.stringify({error:'habit not found'}));
            return;
        }
        habits.splice(index,1);
        await fs.writeFile('habits.json',JSON.stringify(habits,null,2));
        res.writeHead(204);
        res.end();
    }
    else{
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error:'not found'}));
    }
});
server.listen(3000);