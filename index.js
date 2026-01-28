<!DOCTYPE html>
<html>
<head>
    <title>BSS Honey Monitor</title>
    <style>
        body { font-family: sans-serif; background: #1a1a1a; color: white; display: flex; gap: 20px; padding: 20px; flex-wrap: wrap; }
        .card { background: #2d2d2d; border-radius: 12px; padding: 20px; width: 250px; border: 1px solid #444; }
        .username { font-size: 1.2em; color: #ffca28; margin-bottom: 10px; }
        .stat { margin: 5px 0; font-size: 0.9em; }
        .bar-bg { background: #444; height: 10px; border-radius: 5px; margin-top: 10px; overflow: hidden; }
        .bar-fill { background: #4caf50; height: 100%; transition: width 0.5s; }
        .honey-text { color: #fbc02d; font-weight: bold; }
    </style>
</head>
<body>
    <div id="dashboard">รอการเชื่อมต่อจากเกม...</div>

    <script>
        const ws = new WebSocket('ws://localhost:8080');
        const container = document.getElementById('dashboard');

        ws.onmessage = (event) => {
            const allStats = JSON.parse(event.data);
            container.innerHTML = ''; // ล้างหน้าจอเพื่อวาดใหม่

            allStats.forEach(player => {
                const pollenPercent = (player.pollen / player.maxPollen) * 100;
                
                const card = `
                    <div class="card">
                        <div class="username">👤 ${player.username}</div>
                        <div class="stat">🍯 Honey: <span class="honey-text">${player.honey.toLocaleString()}</span></div>
                        <div class="stat">⚪ Pollen: ${player.pollen.toLocaleString()}</div>
                        <div class="bar-bg">
                            <div class="bar-fill" style="width: ${pollenPercent}%"></div>
                        </div>
                        <div style="font-size: 10px; color: #888; margin-top: 10px;">อัปเดตเมื่อ: ${player.lastSeen}</div>
                    </div>
                `;
                container.innerHTML += card;
            });
        };
    </script>
</body>
</html>
