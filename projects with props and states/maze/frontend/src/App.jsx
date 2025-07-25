import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [gold, setGold] = useState(0);
  const [elixir, setElixir] = useState(0);
  const [maxGold, setMaxGold] = useState(500);
  const [maxElixir, setMaxElixir] = useState(500);
  const [buildings, setBuildings] = useState([]);
  const [troops, setTroops] = useState([]);
  const [playerName, setPlayerName] = useState('New Player'); // New state for player name
  const [newPlayerName, setNewPlayerName] = useState(''); // State for input field

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/player');
      const data = await response.json();
      setGold(data.gold);
      setElixir(data.elixir);
      setMaxGold(data.maxGold);
      setMaxElixir(data.maxElixir);
      setBuildings(data.buildings || []);
      setTroops(data.troops || []);
      setPlayerName(data.playerName || 'New Player');
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const updateResources = async () => {
    try {
      await fetch('http://localhost:3000/api/player/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goldIncrement: 1, elixirIncrement: 1 }),
      });
      fetchResources(); // Re-fetch to get updated values
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  };

  const buildBarracks = async () => {
    await buildBuilding('barracks');
  };

  const buildGoldStorage = async () => {
    await buildBuilding('goldStorage');
  };

  const buildElixirStorage = async () => {
    await buildBuilding('elixirStorage');
  };

  const buildBuilding = async (buildingType) => {
    const buildingCosts = {
      barracks: { gold: 50, elixir: 20 },
      goldStorage: { gold: 30, elixir: 10 },
      elixirStorage: { gold: 10, elixir: 30 },
      goldMine: { gold: 100, elixir: 0 },
      elixirCollector: { gold: 0, elixir: 100 },
    };
    const cost = buildingCosts[buildingType];

    if (cost && !window.confirm(`Are you sure you want to build ${buildingType} for ${cost.gold} Gold and ${cost.elixir} Elixir?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/player/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buildingType }),
      });
      if (response.ok) {
        console.log(`Building ${buildingType} successfully placed!`);
        fetchResources(); // Re-fetch to get updated values and buildings
      } else {
        const errorData = await response.json();
        console.error(`Failed to build ${buildingType}. Response status:`, response.status, 'Error data:', errorData);
        alert(errorData || `Failed to build ${buildingType}. Check console for details.`);
      }
    } catch (error) {
      console.error(`Error building ${buildingType} (network or unexpected):`, error);
      alert(`Error building ${buildingType}. Check console for details.`);
    }
  };

  const trainBarbarian = async () => {
    await trainTroop('barbarian');
  };

  const trainArcher = async () => {
    await trainTroop('archer');
  };

  const trainTroop = async (troopType) => {
    const troopCosts = {
      barbarian: { elixir: 10, gold: 0 },
      archer: { elixir: 15, gold: 5 },
    };
    const cost = troopCosts[troopType];

    if (cost && !window.confirm(`Are you sure you want to train ${troopType} for ${cost.gold} Gold and ${cost.elixir} Elixir?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/player/train-troop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ troopType }),
      });
      if (response.ok) {
        fetchResources(); // Re-fetch to get updated values and troops
      } else {
        const errorData = await response.json();
        alert(errorData || `Failed to train ${troopType}`);
      }
    } catch (error) {
      console.error(`Error training ${troopType}:`, error);
      alert(`Error training ${troopType}. Check console for details.`);
    }
  };

  const upgradeBuilding = async (buildingType, index) => {
    const upgradeCosts = {
      barracks: [
        { gold: 100, elixir: 50 }, // Level 2
        { gold: 200, elixir: 100 }, // Level 3
      ],
      goldStorage: [
        { gold: 60, elixir: 20 }, // Level 2
        { gold: 120, elixir: 40 }, // Level 3
      ],
      elixirStorage: [
        { gold: 20, elixir: 60 }, // Level 2
        { gold: 40, elixir: 120 }, // Level 3
      ],
      goldMine: [
        { gold: 200, elixir: 0 }, // Level 2
        { gold: 400, elixir: 0 }, // Level 3
      ],
      elixirCollector: [
        { gold: 0, elixir: 200 }, // Level 2
        { gold: 0, elixir: 400 }, // Level 3
      ],
    };

    const buildingToUpgrade = buildings[index];
    const currentLevel = buildingToUpgrade.level;
    const costForNextLevel = upgradeCosts[buildingType] && upgradeCosts[buildingType][currentLevel - 1];

    if (costForNextLevel && !window.confirm(`Are you sure you want to upgrade ${buildingType} to Level ${currentLevel + 1} for ${costForNextLevel.gold} Gold and ${costForNextLevel.elixir} Elixir?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/player/upgrade-building', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buildingType, index }),
      });
      if (response.ok) {
        fetchResources(); // Re-fetch to get updated values and buildings
      } else {
        const errorData = await response.json();
        alert(errorData || 'Failed to upgrade building');
      }
    } catch (error) {
      console.error('Error upgrading building:', error);
      alert('Error upgrading building. Check console for details.');
    }
  };

  const performAttack = async () => {
    if (!window.confirm(`Are you sure you want to attack? This will consume 1 troop and give you resources.`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/player/attack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchResources(); // Re-fetch to get updated values and troops
        alert('Attack successful! Resources gained.');
      } else {
        const errorData = await response.json();
        alert(errorData || 'Attack failed');
      }
    } catch (error) {
      console.error('Error during attack:', error);
      alert('Error during attack. Check console for details.');
    }
  };

  const handleSetName = async () => {
    if (newPlayerName.trim() === '') {
      alert('Player name cannot be empty.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/player/set-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPlayerName }),
      });
      if (response.ok) {
        fetchResources();
        setNewPlayerName(''); // Clear input
      } else {
        const errorData = await response.json();
        alert(errorData || 'Failed to set player name');
      }
    } catch (error) {
      console.error('Error setting player name:', error);
      alert('Error setting player name. Check console for details.');
    }
  };

  const resetGame = async () => {
    if (!window.confirm('Are you sure you want to reset the game? All your progress will be lost!')) {
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/player/reset', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Game reset successfully!');
        fetchResources(); // Re-fetch to get initial state
      } else {
        const errorData = await response.json();
        alert(errorData || 'Failed to reset game');
      }
    } catch (error) {
      console.error('Error resetting game:', error);
      alert('Error resetting game. Check console for details.');
    }
  };

  const getBuildingIcon = (type) => {
    switch (type) {
      case 'barracks': return '⚔️';
      case 'goldStorage': return '💰';
      case 'elixirStorage': return '🧪';
      case 'goldMine': return '⛏️';
      case 'elixirCollector': return '💧';
      default: return '❓';
    }
  };

  useEffect(() => {
    fetchResources(); // Initial fetch

    const interval = setInterval(updateResources, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="App">
      <h1>My CoC-like Game</h1>
      <div id="player-info">
        <h2>Player: {playerName}</h2>
        <input
          type="text"
          placeholder="Enter new name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <button onClick={handleSetName}>Set Name</button>
      </div>
      <div id="game-container">
        <div id="resources">
          <p>Gold: <span>{gold}</span> / {maxGold}</p>
          <div className="resource-bar-container">
            <div className="resource-bar gold-bar" style={{ width: `${(gold / maxGold) * 100}%` }}></div>
          </div>
          <p>Elixir: <span>{elixir}</span> / {maxElixir}</p>
          <div className="resource-bar-container">
            <div className="resource-bar elixir-bar" style={{ width: `${(elixir / maxElixir) * 100}%` }}></div>
          </div>
        </div>
        <button onClick={buildBarracks}>Build Barracks (Cost: 50 Gold, 20 Elixir)</button>
        <button onClick={buildGoldStorage}>Build Gold Storage (Cost: 30 Gold, 10 Elixir)</button>
        <button onClick={buildElixirStorage}>Build Elixir Storage (Cost: 10 Gold, 30 Elixir)</button>
        <button onClick={() => buildBuilding('goldMine')}>Build Gold Mine (Cost: 100 Gold)</button>
        <button onClick={() => buildBuilding('elixirCollector')}>Build Elixir Collector (Cost: 100 Elixir)</button>
        {buildings.some(b => b.type === 'barracks') && (
          <>
            <button onClick={trainBarbarian}>Train Barbarian (Cost: 10 Elixir)</button>
            <button onClick={trainArcher}>Train Archer (Cost: 15 Elixir, 5 Gold)</button>
          </>
        )}
        {troops.length > 0 && (
          <button onClick={performAttack}>Attack! (Consumes 1 Troop)</button>
        )}
        <div id="base-layout">
          {/* Base building elements will go here */}
          <div className="building" id="gold-mine">Gold Mine</div>
          <div className="building" id="elixir-collector">Elixir Collector</div>
          {buildings.map((building, index) => (
            <div key={index} className="building">
              <span className="building-icon">{getBuildingIcon(building.type)}</span>
              {building.type.charAt(0).toUpperCase() + building.type.slice(1)} (Lvl: {building.level})
              <button onClick={() => upgradeBuilding(building.type, index)}>Upgrade</button>
            </div>
          ))}
        </div>
        <div id="troops-display">
          <h2>Your Troops:</h2>
          {troops.length === 0 ? (
            <p>No troops trained yet.</p>
          ) : (
            <ul>
              {troops.map((troop, index) => (
                <li key={index}>{troop.type.charAt(0).toUpperCase() + troop.type.slice(1)} (Level: {troop.level})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;