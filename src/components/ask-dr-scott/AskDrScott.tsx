'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AskDrScottProps {
  className?: string;
}

export function AskDrScott({ className }: AskDrScottProps) {
  // Use useEffect to inject the HeyGen embed script after component mount
  React.useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    
    // Set the script content to the HeyGen embed code (updated with new share parameters and enhanced styling)
    script.innerHTML = `!function(window){const host="https://labs.heygen.com",url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJlMTJmMDVmMjRlYWQ0MjYxOWI0YWE4MTI0%0D%0AZDk4ODgwZCIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0AL2UxMmYwNWYyNGVhZDQyNjE5YjRhYTgxMjRkOTg4ODBkL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImRl%0D%0AbW8tMSIsInVzZXJuYW1lIjoiNzVhMGJlOTkzNDk5NDQ4NWFkMDAwMDA1ZThlYjIyZDEifQ%3D%3D&inIFrame=1",clientWidth=document.body.clientWidth,wrapDiv=document.createElement("div");wrapDiv.id="heygen-streaming-embed";const container=document.createElement("div");container.id="heygen-streaming-container";const stylesheet=document.createElement("style");stylesheet.innerHTML=\`\\n  #heygen-streaming-embed {\\n    z-index: 9999;\\n    position: fixed;\\n    left: 40px;\\n    bottom: 40px;\\n    width: 200px;\\n    height: 200px;\\n    border-radius: 50%;\\n    border: 3px solid #2563eb;\\n    box-shadow: 0px 12px 32px 0px rgba(37, 99, 235, 0.25);\\n    transition: all linear 0.1s;\\n    overflow: hidden;\\n    background: linear-gradient(135deg, #2563eb, #7c3aed);\\n\\n    opacity: 0;\\n    visibility: hidden;\\n  }\\n  #heygen-streaming-embed.show {\\n    opacity: 1;\\n    visibility: visible;\\n  }\\n  #heygen-streaming-embed.expand {\\n    \${clientWidth<540?"height: 266px; width: 96%; left: 50%; transform: translateX(-50%);":"height: 366px; width: calc(366px * 16 / 9);"}\\n    border: 2px solid #2563eb;\\n    border-radius: 12px;\\n    box-shadow: 0px 16px 48px 0px rgba(37, 99, 235, 0.3);\\n  }\\n  #heygen-streaming-container {\\n    width: 100%;\\n    height: 100%;\\n  }\\n  #heygen-streaming-container iframe {\\n    width: 100%;\\n    height: 100%;\\n    border: 0;\\n  }\\n  \`;const iframe=document.createElement("iframe");iframe.allowFullscreen=!1,iframe.title="Dr. Scott - Professional Educational Psychology Guidance",iframe.role="dialog",iframe.allow="microphone",iframe.src=url;let visible=!1,initial=!1;window.addEventListener("message",(e=>{e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))})),container.appendChild(iframe),wrapDiv.appendChild(stylesheet),wrapDiv.appendChild(container),document.body.appendChild(wrapDiv)}(globalThis);`;
    
    // Append the script to the document body
    document.body.appendChild(script);
    
    // Clean up function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
      // Also try to remove the embed elements if they exist
      const embedDiv = document.getElementById('heygen-streaming-embed');
      if (embedDiv) {
        document.body.removeChild(embedDiv);
      }
    };
  }, []);
  
  return (
    <Card className={className} data-feature="ask-dr-scott">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ask Dr. Scott
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">DS</span>
            </div>
            <div>
              <h3 className="font-bold text-blue-800">Dr. Scott I-Patrick</h3>
              <p className="text-sm text-blue-600">Professional Educational Psychologist</p>
            </div>
          </div>
          <p className="text-blue-800 font-medium mb-3">
            🎯 24/7 Professional Educational Psychology Guidance Available
          </p>
          <p className="text-blue-700 text-sm mb-4">
            Look for the Dr. Scott avatar in the bottom-left corner of your screen.
            Click to start your professional consultation!
          </p>
          <div className="bg-white p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">
              ✨ Real-time professional support • Context-aware guidance • 20+ years expertise
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Ask Dr. Scott any questions about educational psychology, learning strategies, platform features, or professional guidance.
        </p>
      </CardContent>
    </Card>
  );
}
