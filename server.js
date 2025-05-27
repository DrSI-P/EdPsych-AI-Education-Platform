// Simple server.js file to serve a static HTML page
const http = require('http');
require('dotenv').config();

// Create a simple HTML page
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>EdPsych Connect</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .status {
      padding: 1rem;
      background-color: #e6f7ff;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    .success {
      color: #52c41a;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>EdPsych Connect</h1>
    <div class="status">
      <p>Server Status: <span class="success">Online</span></p>
    </div>
    <p>The EdPsych Connect platform is currently being updated with new features.</p>
    <p>We'll be back online shortly with our full application.</p>
    <p>Thank you for your patience!</p>
  </div>
</body>
</html>
`;

// Create server
const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);
  
  // Set headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Send the HTML response
  res.writeHead(200);
  res.end(html);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});