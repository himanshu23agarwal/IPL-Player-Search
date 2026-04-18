const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 2500;
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/ip13')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
const playerSchema = new mongoose.Schema({
    name: String,
    ipl_franchise: String,
    country: String,
    bid_amount: Number
});
const Player = mongoose.model('Player', playerSchema);
const players = [
    {
        name: 'M.S Dhoni', ipl_franchise: 'Rising Pune Super Giants', country: 'India', bid_amount:
            5000000
    },
    { name: 'Raina', ipl_franchise: 'Gujrat Lions', country: 'India', bid_amount: 50000 },
    { name: 'Bravo', ipl_franchise: 'Gujrat Lions', country: 'West Indies', bid_amount: 2000000 },
    {
        name: 'Chris Gayle', ipl_franchise: 'Royal Challengers Bangalore', country: 'West Indies',
        bid_amount: 100000
    },
    {
        name: 'du Plessis', ipl_franchise: 'Rising Pune Super Giants', country: 'South Africa',
        bid_amount: 150000
    },
    {
        name: 'Virat Kohli', ipl_franchise: 'Royal Challengers Bangalore', country: 'India', bid_amount:
            20000000
    },
    {
        name: 'David Warner', ipl_franchise: 'Sunrisers Hyderabad', country: 'Australia', bid_amount:
            100000
    },
    {
        name: 'Sunil Narine', ipl_franchise: 'Kolkata Knight Riders', country: 'Sri Lanka', bid_amount:
            160000
    }
];
app.get('/insert', async (req, res) => {
    await Player.deleteMany({});
    await Player.insertMany(players);
    res.send("Sample data inserted");
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/search', async (req, res) => {
    try {
        const { find, find_details } = req.body;
        if (!find_details) {
            const player = await Player.findOne({
                name: { $regex: find, $options: "i" }
            });
            if (!player) return res.send("Player not found");
            return res.send(`
Player: ${player.name} <br>
IPL Franchise: ${player.ipl_franchise} <br>
Country: ${player.country} <br>
Bid Amount: ${player.bid_amount}
`);
        }
        if (find_details === "ipl") {
            const players = await Player.find({ country: find });
            if (players.length === 0)
                return res.send("No players found");
            return res.send(players.map(p => `
Player: ${p.name} <br>
IPL: ${p.ipl_franchise} <br>
Country: ${p.country}
<hr>
`).join(""));
        }
        if (find_details === "bid") {
            const players = await Player.find({
                bid_amount: { $gte: parseInt(find) }
            });
            if (players.length === 0)
                return res.send("No players found");
            return res.send(players.map(p => `
Player: ${p.name} <br>
IPL: ${p.ipl_franchise} <br>
Bid: ${p.bid_amount}
<hr>
`).join(""));
        }
    } catch (err) {
        console.log(err);
        res.send("Error occurred");
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});