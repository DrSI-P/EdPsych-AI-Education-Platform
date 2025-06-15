'use client';

import React from 'react';
import Link from 'next/link';

export default function ExecutiveDysfunctionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Executive Dysfunction Support</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Understanding Executive Dysfunction</h2>
        <p className="mb-4">
          Executive dysfunction refers to difficulties with the cognitive processes that help us plan, focus attention, 
          remember instructions, and manage multiple tasks. These skills are controlled by the brain's frontal lobe and 
          are critical for self-regulation and accomplishing goals.
        </p>
        <p className="mb-4">
          Executive dysfunction is common in individuals with ADHD, autism, depression, anxiety, and other 
          neurodevelopmental or psychological conditions. However, it can also occur due to stress, lack of sleep, 
          or during particularly challenging life transitions.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Common Challenges</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Task Initiation:</strong> Difficulty starting tasks despite the intention to do so</li>
          <li><strong>Planning and Organization:</strong> Struggles with breaking down complex tasks into manageable steps</li>
          <li><strong>Time Management:</strong> Challenges estimating how long tasks will take and meeting deadlines</li>
          <li><strong>Working Memory:</strong> Trouble keeping information in mind while using it</li>
          <li><strong>Self-Monitoring:</strong> Difficulty tracking one's own performance and adjusting behavior</li>
          <li><strong>Emotional Regulation:</strong> Challenges managing emotional responses appropriately</li>
          <li><strong>Cognitive Flexibility:</strong> Struggles with adapting to changing situations or requirements</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Strategies and Support</h2>
        
        <h3 className="text-xl font-medium mb-3">Environmental Modifications</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Create a dedicated workspace with minimal distractions</li>
          <li>Use visual cues and reminders in your environment</li>
          <li>Implement color-coding systems for organization</li>
          <li>Set up structured routines for daily activities</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-3">Task Management Techniques</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Break down large tasks into smaller, manageable steps</li>
          <li>Use the "body doubling" technique (working alongside someone else)</li>
          <li>Implement the Pomodoro Technique (25 minutes of work followed by a 5-minute break)</li>
          <li>Create detailed checklists for complex procedures</li>
          <li>Use the "5-minute rule" - commit to just starting a task for 5 minutes</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-3">Digital Tools</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Calendar apps with reminders and notifications</li>
          <li>Task management applications (Todoist, Trello, Asana)</li>
          <li>Time tracking tools to improve time awareness</li>
          <li>Note-taking apps with organization features</li>
          <li>Browser extensions that block distracting websites</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">When to Seek Professional Help</h2>
        <p className="mb-4">
          If executive dysfunction significantly impacts your daily life, relationships, or academic/professional 
          performance, it may be beneficial to seek support from professionals such as:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Psychologists or therapists specializing in cognitive behavioral therapy (CBT)</li>
          <li>Occupational therapists who can provide strategies for daily living</li>
          <li>Educational specialists who can help with academic accommodations</li>
          <li>Psychiatrists who can evaluate whether medication might be helpful</li>
        </ul>
        <p className="mb-4">
          Professional assessment can also help identify underlying conditions that may be contributing to executive 
          dysfunction and provide targeted interventions.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Resources for Further Support</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Books: "Smart but Scattered" by Peg Dawson and Richard Guare</li>
          <li>Online communities: ADHD and autism support groups</li>
          <li>Apps: Focus apps, reminder systems, and organizational tools</li>
          <li>Websites: ADDitude Magazine, Understood.org</li>
        </ul>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
