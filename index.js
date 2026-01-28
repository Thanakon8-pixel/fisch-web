const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

let players = {}; 

// รับข้อมูลจาก Roblox
app.post('/update', (req, res) => {
    const data = req.body;
    console.log("ได้รับข้อมูล:", data); // ดูใน Logs ของ Render

    if (data && data.username) {
        players[data.username] = {
            level: data.level || 0,
            money: data.money || 0,
            fish: data.fish || "Fishing...",
            rod: data.rod || "None",
            time: new Date().toLocaleTimeString('th-TH')
        };
        // ส่งกระจายเสียงไปที่หน้าเว็บทันที
        io.emit('dataUpdate', players);
    }
    res.status(200).send("OK");
});

// หน้าแสดงผล
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FISCH LIVE TRACKER</title>
            <script src="/socket.io/socket.io.js"></script>
            <style>
                body { background: #0b0b0b; color: #e0e0e0; font-family: sans-serif; padding: 20px; }
                .container { max-width: 1000px; margin: auto; background: #161616; padding: 20px; border-radius: 12px; border: 1px solid #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { text-align: left; color: #00ff88; padding: 12px; border-bottom: 2px solid #333; }
                td { padding: 12px; border-bottom: 1px solid #222; }
                .live-dot { height: 10px; width: 10px; background: #ff4444; border-radius: 50%; display: inline-block; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }
            </style>
        </head>
        <body>
            <div class="container">
                <h2><span class="live-dot"></span> FISCH GLOBAL TRACKER (REAL-TIME)</h2>
                <table>
                    <thead>
                        <tr><th>Player</th><th>Level</th><th>Money</th><th>Recent Fish</th><th>Rod</th><th>Update</th></tr>
                    </thead>
                    <tbody id="player-list">
                        <tr><td colspan="6" style="text-align:center">Waiting for game data...</td></tr>
                    </tbody>
                </table>
            </div>
            <script>
                const socket = io();
                const tbody = document.getElementById('player-list');

                socket.on('dataUpdate', (players) => {
                    console.log("Update received!");
                    tbody.innerHTML = Object.keys(players).map(name => {
                        const p = players[name];
                        return \`<tr>
                            <td><b>\${name}</b></td>
                            <td style="color:#00ff88">Lv. \${p.level}</td>
                            <td style="color:#ffd700">\${p.money.toLocaleString()} C$</td>
                            <td>\${p.fish}</td>
                            <td>\${p.rod}</td>
                            <td style="color:#666; font-size:12px">\${p.time}</td>
                        </tr>\`;
                    }).join('');
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server is Online'));
