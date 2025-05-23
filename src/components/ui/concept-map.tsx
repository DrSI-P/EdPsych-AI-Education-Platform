'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ConceptMapProps {
  title: string;
  description?: string;
  nodes: ConceptNode[];
  connections: ConceptConnection[];
  className?: string;
  keyStage?: 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4';
}

interface ConceptNode {
  id: string;
  label: string;
  description?: string;
  x: number; // 0-100 percentage position
  y: number; // 0-100 percentage position
  type?: 'primary' | 'secondary' | 'tertiary';
  subject?: 'maths' | 'english' | 'science' | 'history' | 'geography' | 'art';
}

interface ConceptConnection {
  from: string; // node id
  to: string; // node id
  label?: string;
  type?: 'solid' | 'dashed' | 'dotted';
  direction?: 'one-way' | 'two-way';
}

export function ConceptMap({
  title,
  description,
  nodes,
  connections,
  className,
  keyStage
}: ConceptMapProps) {
  const keyStageClass = keyStage ? `theme-${keyStage}` : '';
  
  // Generate unique ID for SVG elements
  const svgId = React.useId();
  
  // Calculate node positions and render nodes
  const renderNodes = () => {
    return nodes.map((node) => {
      const nodeTypeClass = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        tertiary: 'bg-tertiary text-white'
      };
      
      const subjectClass = node.subject ? `subject-${node.subject}` : '';
      const typeClass = node.type ? nodeTypeClass[node.type] : nodeTypeClass.primary;
      
      return (
        <div
          key={node.id}
          className={cn(
            'absolute rounded-lg p-3 shadow-md',
            typeClass,
            subjectClass,
            'transform -translate-x-1/2 -translate-y-1/2',
            'transition-all duration-300 hover:scale-105 hover:z-10'
          )}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            maxWidth: '200px'
          }}
          data-node-id={node.id}
        >
          <h4 className="font-bold text-sm">{node.label}</h4>
          {node.description && (
            <p className="text-xs mt-1 opacity-90">{node.description}</p>
          )}
        </div>
      );
    });
  };
  
  // Render connections between nodes
  const renderConnections = () => {
    // Create SVG paths for connections
    return (
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={`${svgId}-arrow`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
          <marker
            id={`${svgId}-arrow-two-way`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        
        {connections.map((connection, index) => {
          // Find the connected nodes
          const fromNode = nodes.find(n => n.id === connection.from);
          const toNode = nodes.find(n => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          // Calculate path
          const x1 = `${fromNode.x}%`;
          const y1 = `${fromNode.y}%`;
          const x2 = `${toNode.x}%`;
          const y2 = `${toNode.y}%`;
          
          // Determine stroke style
          const strokeStyle = {
            solid: '',
            dashed: '5,5',
            dotted: '2,2'
          };
          
          // Determine markers
          const markerEnd = connection.direction !== 'two-way' ? `url(#${svgId}-arrow)` : '';
          const markerStart = connection.direction === 'two-way' ? `url(#${svgId}-arrow-two-way)` : '';
          
          return (
            <g key={`connection-${index}`} className="text-gray-500">
              <path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray={connection.type ? strokeStyle[connection.type] : ''}
                markerEnd={markerEnd}
                markerStart={markerStart}
              />
              
              {connection.label && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-current"
                  transform={`translate(
                    ${(parseFloat(x1) + parseFloat(x2)) / 2}%,
                    ${(parseFloat(y1) + parseFloat(y2)) / 2}%
                  )`}
                >
                  <tspan
                    dx="0"
                    dy="0"
                    className="bg-white dark:bg-gray-800 px-1 rounded"
                  >
                    {connection.label}
                  </tspan>
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };
  
  return (
    <div className={cn(
      'concept-map',
      keyStageClass,
      'relative min-h-[400px] p-4',
      className
    )}>
      <div className="mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      
      <div className="relative w-full h-[400px]">
        {renderConnections()}
        {renderNodes()}
      </div>
    </div>
  );
}

export default ConceptMap;
