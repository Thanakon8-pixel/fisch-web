const express = require('express');
const app = express();
app.use(express.json());

let playerStats = {}; // เก็บข้อมูลแยกรายคน

app.post('/update', (req, res) => {
    const { username, fish, money, level, rod, timestamp } = req.body;
    playerStats[username] = { fish, money, level, rod, timestamp };
    res.send("Updated");
});

app.get('/', (req, res) => {
    let rows = Object.keys(playerStats).map(user => {
        let d = playerStats[user];
        return `
            <tr>
                <td>${user}</td>
                <td>${d.level}</td>
                <td>${d.money.toLocaleString()}</td>
                <td>${d.fish}</td>
                <td>${d.rod}</td>
                <td>${d.timestamp}</td>
            </tr>`;
    }).join('');

    res.send(`
        <html>
        <head>
            <title>Fisch Live Stats</title>
            <style>
                body { font-family: sans-serif; background: #1a1a1a; color: white; padding: 20px; }
                table { width: 100%; border-collapse: collapse; background: #2a2a2a; }
                th, td { padding: 12px; border: 1px solid #444; text-align: left; }
                th { background: #333; color: #00ff88; }
            </style>
        </head>
        <body>
            <h1>🎣 Fisch Global Tracker</h1>
            <table>
                <tr>
                    <th>Username</th><th>Level</th><th>Money</th><th>Recent Fish</th><th>Rod</th><th>Last Seen</th>
                </tr>
                ${rows}
            </table>
            <script>setTimeout(() => location.reload(), 3000);</script>
        </body>
        </html>
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
