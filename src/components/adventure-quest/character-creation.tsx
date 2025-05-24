'use client';

import React from 'react';

// Empty placeholder components for the missing components referenced in adventure-quest files
const CharacterCreation = ({ onCreateCharacter }) => {
  return (
    <div>
      <h2>Character Creation</h2>
      <button onClick={() => onCreateCharacter({
        id: 'char1',
        name: 'Default Character',
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        attributes: {
          intelligence: 5,
          creativity: 5,
          persistence: 5,
          curiosity: 5
        },
        inventory: [],
        achievements: []
      })}>
        Create Default Character
      </button>
    </div>
  );
};

const QuestDetail = ({ quest, onComplete, onBack }) => {
  return (
    <div>
      <h2>Quest Detail: {quest?.title || 'Unknown Quest'}</h2>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onComplete(quest, { score: 80, timeSpent: 1200, completedChallenges: 3 })}>
        Complete Quest
      </button>
    </div>
  );
};

const QuestHub = ({ quests, character, onSelectQuest, onGenerateQuest }) => {
  return (
    <div>
      <h2>Quest Hub</h2>
      <button onClick={onGenerateQuest}>Generate New Quest</button>
      <div>
        {quests.map(quest => (
          <div key={quest.id}>
            <h3>{quest.title}</h3>
            <button onClick={() => onSelectQuest(quest)}>Start Quest</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CharacterDashboard = ({ character, completedQuests, onBack }) => {
  return (
    <div>
      <h2>Character Dashboard: {character?.name || 'Unknown Character'}</h2>
      <p>Level: {character?.level || 1}</p>
      <p>XP: {character?.xp || 0}</p>
      <p>Completed Quests: {completedQuests?.length || 0}</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export { CharacterCreation, QuestDetail, QuestHub, CharacterDashboard };
