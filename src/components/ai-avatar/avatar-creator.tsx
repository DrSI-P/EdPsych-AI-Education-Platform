"use client";

import React from 'react';

/**
 * AvatarCreator component
 * This component provides an interface for creating and customizing AI avatars
 */
export const AvatarCreator = ({ 
  onAvatarCreated,
  className = ''
}) => {
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [style, setStyle] = React.useState('professional');
  const [gender, setGender] = React.useState('female');
  
  const handleCreate = async () => {
    if (!name) return;
    
    setCreating(true);
    // Simulate avatar creation
    setTimeout(() => {
      setCreating(false);
      if (onAvatarCreated) {
        onAvatarCreated({
          id: `avatar-${Date.now()}`,
          name,
          style,
          gender,
          imageUrl: 'https://example.com/avatars/sample.jpg'
        });
      }
    }, 2000);
  };
  
  return (
    <div className={`avatar-creator ${className}`}>
      <h2 className="text-xl font-bold mb-4">Create AI Avatar</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Avatar Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter avatar name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Style</label>
        <select 
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
          <option value="authoritative">Authoritative</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Gender</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="mr-2"
            />
            Male
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="mr-2"
            />
            Female
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={gender === 'neutral'}
              onChange={() => setGender('neutral')}
              className="mr-2"
            />
            Neutral
          </label>
        </div>
      </div>
      
      <button
        onClick={handleCreate}
        disabled={creating || !name}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {creating ? 'Creating...' : 'Create Avatar'}
      </button>
    </div>
  );
};


