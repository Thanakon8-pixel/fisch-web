const express = require('express');
const app = express();
app.use(express.json());

let players = {}; 

// รับข้อมูลจาก Roblox
app.post('/update', (req, res) => {
    const data = req.body;
    console.log("Received Data:", data); // ดูใน Logs ของ Render จะเห็นข้อมูลเด้งรัวๆ

    if (data && data.username) {
        players[data.username] = {
            level: data.level || 0,
            money: data.money || 0,
            fish: data.fish || "Fishing...",
            rod: data.rod || "None",
            time: new Date().toLocaleTimeString('th-TH')
        };
    }
    res.status(200).send("OK");
});

// หน้าแสดงผล (เวอร์ชันชัวร์ที่สุด)
app.get('/', (req, res) => {
    let rows = Object.keys(players).map(name => {
        const p = players[name];
        return `
            <tr>
                <td><b>${name}</b></td>
                <td style="color:#00ff88">Lv. ${p.level}</td>
                <td style="color:#ffd700">${p.money.toLocaleString()} C$</td>
                <td>${p.fish}</td>
                <td>${p.rod}</td>
                <td style="color:#666; font-size:12px">${p.time}</td>
            </tr>`;
    }).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>FISCH LIVE TRACKER</title>
            <meta http-equiv="refresh" content="3"> <style>
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
                <h2><span class="live-dot"></span> FISCH GLOBAL TRACKER</h2>
                <p style="font-size:12px; color:#555">Auto-refreshing every 3s...</p>
                <table>
                    <thead>
                        <tr><th>Player</th><th>Level</th><th>Money</th><th>Recent Fish</th><th>Rod</th><th>Update</th></tr>
                    </thead>
                    <tbody>
                        ${rows || '<tr><td colspan="6" style="text-align:center">Waiting for game data... (Try fishing in-game)</td></tr>'}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is Online'));
