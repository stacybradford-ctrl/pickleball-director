"use client";

import { useState, useEffect } from "react";

const categories = [
  "Child",
  "Adult Beginner Doubles",
  "Adult Intermediate Doubles",
];

const TOTAL_COURTS = 6;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pairPlayers(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 2) {
    if (list[i + 1]) {
      pairs.push({ teamA: list[i], teamB: list[i + 1] });
    }
  }
  return pairs;
}

function generateRoundRobin(teams) {
  const schedule = [];
  let court = 1;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      schedule.push({
        team1: teams[i],
        team2: teams[j],
        score1: "",
        score2: "",
        court,
      });

      court++;
      if (court > TOTAL_COURTS) court = 1;
    }
  }

  return schedule;
}

export default function PickleballDirector() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [schedules, setSchedules] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const saved = localStorage.getItem("pickleballTournament");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlayers(parsed.players || []);
      setSchedules(parsed.schedules || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pickleballTournament",
      JSON.stringify({ players, schedules })
    );
  }, [players, schedules]);

  const addPlayer = () => {
    if (!name) return;
    setPlayers([...players, { name, category }]);
    setName("");
  };

  const removePlayer = (index) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };

  const randomizeCategory = (cat) => {
    const others = players.filter((p) => p.category !== cat);
    const target = shuffle(players.filter((p) => p.category === cat));
    setPlayers([...others, ...target]);
  };

  const generateSchedule = (cat) => {
    const catPlayers = players.filter((p) => p.category === cat);

    const pairs = pairPlayers(catPlayers)
      .map((p) => `${p.teamA.name} & ${p.teamB.name}`);

    const schedule = generateRoundRobin(pairs);

    setSchedules({ ...schedules, [cat]: schedule });
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>

      <h1>🏓 Pickleball Tournament Director</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>

        {categories.map((c) => (
          <button key={c} onClick={() => setActiveTab(c)}>
            {c}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div>

          <h2>Add Player</h2>

          <input
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button onClick={addPlayer}>Add Player</button>

          <h3>All Players</h3>

          {players.map((p, i) => (
            <div key={i}>
              {p.name} ({p.category})
              <button onClick={() => removePlayer(i)}>Remove</button>
            </div>
          ))}

        </div>
      )}

      {categories.map((cat) => {
        if (activeTab !== cat) return null;

        const catPlayers = players.filter((p) => p.category === cat);
        const pairs = pairPlayers(catPlayers);

        return (
          <div key={cat}>

            <h2>{cat}</h2>

            <button onClick={() => randomizeCategory(cat)}>
              Randomize Teams
            </button>

            <button onClick={() => generateSchedule(cat)}>
              Generate Matches
            </button>

            <h3>Teams</h3>

            {pairs.map((p, i) => (
              <div key={i}>
                {p.teamA.name} & {p.teamB.name}
              </div>
            ))}

            {schedules[cat] && (
              <>
                <h3>Matches</h3>

                {schedules[cat].map((m, i) => (
                  <div key={i}>
                    Court {m.court} — {m.team1} vs {m.team2}
                  </div>
                ))}
              </>
            )}

          </div>
        );
      })}

    </div>
  );
}
