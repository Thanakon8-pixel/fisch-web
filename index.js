const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

let players = {}; 

app.post('/update', (req, res) => {
    const data = req.body;
    if (data.username) {
        players[data.username] = {
            level: data.level || 0,
            money: data.money || 0,
            fish: data.fish || "Fishing...",
            rod: data.rod || "None",
            time: new Date().toLocaleTimeString()
        };
        io.emit('dataUpdate', players); // ส่งข้อมูลไปหน้าเว็บทันทีแบบ Real-time
    }
    res.status(200).send("OK");
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FISCH LIVE TRACKER</title>
            <script src="/socket.io/socket.io.js"></script>
            <style>
                body { background: #0b0b0b; color: #e0e0e0; font-family: 'Inter', sans-serif; padding: 40px; }
                .card { background: #161616; border-radius: 12px; padding: 20px; border: 1px solid #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { text-align: left; color: #00ff88; padding: 12px; border-bottom: 2px solid #333; text-transform: uppercase; font-size: 12px; }
                td { padding: 12px; border-bottom: 1px solid #222; }
                .live-dot { height: 10px; width: 10px; background-color: #ff4444; border-radius: 50%; display: inline-block; margin-right: 5px; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            </style>
        </head>
        <body>
            <div class="card">
                <h2><span class="live-dot"></span> FISCH GLOBAL TRACKER</h2>
                <table>
                    <thead><tr><th>Player</th><th>Level</th><th>Money</th><th>Last Fish</th><th>Rod</th><th>Updated</th></tr></thead>
                    <tbody id="player-list"></tbody>
                </table>
            </div>
            <script>
                const socket = io();
                socket.on('dataUpdate', (players) => {
                    const tbody = document.getElementById('player-list');
                    tbody.innerHTML = Object.keys(players).map(name => {
                        const p = players[name];
                        return \`<tr>
                            <td style="font-weight:bold">\${name}</td>
                            <td style="color:#00ff88">Lv. \${p.level}</td>
                            <td style="color:#ffd700">\${p.money.toLocaleString()} C$</td>
                            <td>\${p.fish}</td>
                            <td style="color:#aaa">\${p.rod}</td>
                            <td style="color:#555">\${p.time}</td>
                        </tr>\`;
                    }).join('');
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server is Live!'));
