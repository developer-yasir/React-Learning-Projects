const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/coc_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

// Player Schema
const PlayerSchema = new mongoose.Schema({
    gold: {
        type: Number,
        default: 0
    },
    elixir: {
        type: Number,
        default: 0
    },
    playerName: {
        type: String,
        default: 'New Player'
    },
    maxGold: {
        type: Number,
        default: 500 // Starting max gold capacity
    },
    maxElixir: {
        type: Number,
        default: 500 // Starting max elixir capacity
    },
    buildings: [
        {
            type: String, // e.g., 'barracks', 'goldMine', 'elixirCollector'
            level: { type: Number, default: 1 },
            // Add more properties like position if needed later
        },
    ],
    troops: [
        {
            type: String, // e.g., 'barbarian', 'archer'
            level: { type: Number, default: 1 },
        },
    ],
});

const Player = mongoose.model('Player', PlayerSchema);

// API Endpoints

// Get player data (or create if not exists)
app.get('/api/player', async (req, res) => {
    try {
        let player = await Player.findOne();
        if (!player) {
            player = new Player();
            await player.save();
        }
        res.json(player);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update player resources (for demonstration, we'll just increment)
app.post('/api/player/resources', async (req, res) => {
    try {
        let player = await Player.findOne();
        if (player) {
            // Increment resources from passive generation (e.g., Gold Mine, Elixir Collector)
            player.buildings.forEach(building => {
                const productionRate = upgradeCosts[building.type] && upgradeCosts[building.type][building.level - 1] && upgradeCosts[building.type][building.level - 1].production || 1; // Default to 1 if not defined
                if (building.type === 'goldMine') {
                    player.gold = Math.min(player.gold + productionRate, player.maxGold);
                } else if (building.type === 'elixirCollector') {
                    player.elixir = Math.min(player.elixir + productionRate, player.maxElixir);
                }
            });

            // Increment resources from explicit request (e.g., attack rewards, or previous resource increment logic)
            player.gold = Math.min(player.gold + (req.body.goldIncrement || 0), player.maxGold);
            player.elixir = Math.min(player.elixir + (req.body.elixirIncrement || 0), player.maxElixir);

            await player.save();
            res.json(player);
        } else {
            res.status(404).send('Player not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Build a new building
app.post('/api/player/build', async (req, res) => {
    const { buildingType } = req.body;
    console.log('Received build request:', { buildingType });

    try {
        let player = await Player.findOne();
        if (!player) {
            console.log('Player not found, creating new player.');
            player = new Player();
            await player.save();
        }

        // Define building costs (example)
        const buildingCosts = {
            barracks: { gold: 50, elixir: 20 },
            goldStorage: { gold: 30, elixir: 10, capacityGold: 500 },
            elixirStorage: { gold: 10, elixir: 30, capacityElixir: 500 },
            goldMine: { gold: 100, elixir: 0 },
            elixirCollector: { gold: 0, elixir: 100 },
        };

        const cost = buildingCosts[buildingType];

        if (!cost) {
            return res.status(400).send('Invalid building type');
        }

        if (player.gold < cost.gold || player.elixir < cost.elixir) {
            return res.status(400).send('Insufficient resources');
        }

        player.gold -= cost.gold;
        player.elixir -= cost.elixir;

        if (buildingType === 'goldStorage') {
            player.maxGold += cost.capacityGold;
        } else if (buildingType === 'elixirStorage') {
            player.maxElixir += cost.capacityElixir;
        }

        player.buildings.push({ type: buildingType });

        await player.save();
        console.log('Building successfully placed:', player.buildings[player.buildings.length - 1]);
        res.json(player);

    } catch (err) {
        console.error('Error in /api/player/build:', err);
        res.status(500).send('Server Error');
    }
});

// Train a new troop
app.post('/api/player/train-troop', async (req, res) => {
    const { troopType } = req.body;

    try {
        let player = await Player.findOne();
        if (!player) {
            return res.status(404).send('Player not found');
        }

        // Define troop costs (example)
        const troopCosts = {
            barbarian: { elixir: 10 },
            archer: { elixir: 15, gold: 5 }, // Example cost for Archer
        };

        const cost = troopCosts[troopType];

        if (!cost) {
            return res.status(400).send('Invalid troop type');
        }

        if (player.elixir < cost.elixir) {
            return res.status(400).send('Insufficient elixir');
        }

        // Check if player has a barracks to train troops
        const hasBarracks = player.buildings.some(b => b.type === 'barracks');
        if (!hasBarracks) {
            return res.status(400).send('Requires Barracks to train troops');
        }

        player.elixir -= cost.elixir;
        player.troops.push({ type: troopType });

        await player.save();
        res.json(player);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Upgrade a building
app.post('/api/player/upgrade-building', async (req, res) => {
    const { buildingType, index } = req.body;

    try {
        let player = await Player.findOne();
        if (!player) {
            return res.status(404).send('Player not found');
        }

        if (index === undefined || !player.buildings[index]) {
            return res.status(400).send('Building not found');
        }

        const buildingToUpgrade = player.buildings[index];

        // Define upgrade costs (example: costs increase with level)
        const upgradeCosts = {
            barracks: [
                { gold: 100, elixir: 50 }, // Level 2
                { gold: 200, elixir: 100 }, // Level 3
                // Add more levels as needed
            ],
            goldStorage: [
                { gold: 60, elixir: 20, capacityGold: 500 }, // Level 2
                { gold: 120, elixir: 40, capacityGold: 500 }, // Level 3
            ],
            elixirStorage: [
                { gold: 20, elixir: 60, capacityElixir: 500 }, // Level 2
                { gold: 40, elixir: 120, capacityElixir: 500 }, // Level 3
            ],
            goldMine: [
                { gold: 200, elixir: 0, production: 1 }, // Level 2: +1 gold/tick
                { gold: 400, elixir: 0, production: 1 }, // Level 3: +1 gold/tick
            ],
            elixirCollector: [
                { gold: 0, elixir: 200, production: 1 }, // Level 2: +1 elixir/tick
                { gold: 0, elixir: 400, production: 1 }, // Level 3: +1 elixir/tick
            ],
        };

        const currentLevel = buildingToUpgrade.level;
        const costForNextLevel = upgradeCosts[buildingToUpgrade.type] && upgradeCosts[buildingToUpgrade.type][currentLevel - 1]; // currentLevel - 1 because array is 0-indexed

        if (!costForNextLevel) {
            return res.status(400).send('No more upgrades available for this building type or level');
        }

        if (player.gold < costForNextLevel.gold || player.elixir < costForNextLevel.elixir) {
            return res.status(400).send('Insufficient resources for upgrade');
        }

        player.gold -= costForNextLevel.gold;
        player.elixir -= costForNextLevel.elixir;
        buildingToUpgrade.level += 1;

        await player.save();
        res.json(player);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Attack endpoint
app.post('/api/player/attack', async (req, res) => {
    try {
        let player = await Player.findOne();
        if (!player) {
            return res.status(404).send('Player not found');
        }

        if (player.troops.length === 0) {
            return res.status(400).send('No troops available for attack!');
        }

        const attackedTroop = player.troops.shift(); // Consume one troop
        const troopType = attackedTroop.type;

        // Define attack rewards based on troop type
        const attackRewards = {
            barbarian: { gold: 75, elixir: 30 },
            archer: { gold: 50, elixir: 50 }, // Example rewards for Archer
        };

        const reward = attackRewards[troopType];

        if (!reward) {
            return res.status(500).send('Unknown troop type for attack reward');
        }

        // Award resources
        player.gold = Math.min(player.gold + reward.gold, player.maxGold);
        player.elixir = Math.min(player.elixir + reward.elixir, player.maxElixir);

        await player.save();
        res.json(player);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/api/player/attack', async (req, res) => {
    try {
        let player = await Player.findOne();
        if (!player) {
            return res.status(404).send('Player not found');
        }

        if (player.troops.length === 0) {
            return res.status(400).send('No troops available for attack!');
        }

        const attackedTroop = player.troops.shift(); // Consume one troop
        const troopType = attackedTroop.type;

        // Define attack rewards based on troop type
        const attackRewards = {
            barbarian: { gold: 75, elixir: 30 },
            archer: { gold: 50, elixir: 50 }, // Example rewards for Archer
        };

        const reward = attackRewards[troopType];

        if (!reward) {
            return res.status(500).send('Unknown troop type for attack reward');
        }

        // Award resources
        player.gold = Math.min(player.gold + reward.gold, player.maxGold);
        player.elixir = Math.min(player.elixir + reward.elixir, player.maxElixir);

        await player.save();
        res.json(player);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Set player name
app.post('/api/player/set-name', async (req, res) => {
    const { name } = req.body;
    try {
        let player = await Player.findOne();
        if (!player) {
            return res.status(404).send('Player not found');
        }
        player.playerName = name;
        await player.save();
        res.json(player);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Reset game data
app.post('/api/player/reset', async (req, res) => {
    try {
        await Player.deleteMany({}); // Delete all player documents
        res.status(200).send('Game data reset successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});