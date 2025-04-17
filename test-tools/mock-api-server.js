const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// N8N webhook URL - This is used by the server for direct API validation
// The test script will use this same URL via environment variable or its own default
// This is the production URL - the workflow must be set to active
const N8N_URL = 'https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create logs directory if it doesn't exist
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Create a log file for this session
const LOG_FILE = path.join(LOG_DIR, `test-log-${new Date().toISOString().replace(/:/g, '-')}.json`);
fs.writeFileSync(LOG_FILE, '[]');

// Helper function to log entries
function logEntry(entry) {
  try {
    // Read existing logs
    let logs = [];
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (error) {
      console.error('Error reading log file, creating new one:', error.message);
      fs.writeFileSync(LOG_FILE, '[]');
    }
    
    // Add new entry
    logs.push(entry);
    
    // Write back to file
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    console.log(`Logged ${entry.type} at ${entry.timestamp}`);
    
    // For response entries, try to parse and log the output for better debugging
    if (entry.type === 'response' && entry.response && entry.response.output) {
      try {
        const parsedOutput = JSON.parse(entry.response.output);
        console.log('Parsed output from n8n:');
        console.log(JSON.stringify(parsedOutput, null, 2));
      } catch (error) {
        console.error('Could not parse n8n output:', error.message);
      }
    }
  } catch (error) {
    console.error('Error logging entry:', error.message);
  }
}

// Endpoint to validate injury reports
app.post('/api/validate', async (req, res) => {
  const requestData = req.body;
  
  // Log the request
  logEntry({
    type: 'request',
    timestamp: new Date().toISOString(),
    request: requestData
  });
  
  try {
    console.log('Forwarding request to n8n webhook');
    const n8nResponse = await axios.post(N8N_URL, requestData);
    
    // Log the response
    logEntry({
      type: 'response',
      timestamp: new Date().toISOString(),
      response: n8nResponse.data
    });
    
    res.json(n8nResponse.data);
  } catch (error) {
    console.error('Error forwarding to n8n:', error.message);
    
    // Log the error
    logEntry({
      type: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      request: requestData
    });
    
    res.status(500).json({ error: 'Error forwarding request to n8n' });
  }
});

// Endpoints to run tests
app.post('/api/test/inadequate', async (req, res) => {
  console.log('Running inadequate report test...');
  
  try {
    // Define test data
    const testData = {
      child_id: 'child123',
      child_name: 'Test Child',
      injury_time_eastern: '2025-04-17 11:30 AM EDT',
      location: 'Playground',
      submitting_user_id: 'teacher456',
      incident_description: '2',
      injury_description: '2',
      action_taken: '2',
      is_bite: false,
      is_peer_aggression: false
    };
    
    // Log the request
    logEntry({
      type: 'request',
      timestamp: new Date().toISOString(),
      request: testData
    });
    
    // Send directly to n8n
    console.log(`Sending request to ${N8N_URL}`);
    const response = await axios.post(N8N_URL, testData);
    
    // Log the response
    logEntry({
      type: 'response',
      timestamp: new Date().toISOString(),
      response: response.data
    });
    
    console.log('Test completed successfully');
    res.json({ status: 'success', message: 'Test completed' });
  } catch (error) {
    console.error('Error running test:', error.message);
    res.status(500).json({ error: 'Error running test' });
  }
});

app.post('/api/test/mixed', async (req, res) => {
  console.log('Running mixed adequacy report test...');
  
  try {
    // Define test data
    const testData = {
      child_id: 'child123',
      child_name: 'Test Child',
      injury_time_eastern: '2025-04-17 11:30 AM EDT',
      location: 'Playground',
      submitting_user_id: 'teacher456',
      incident_description: 'Child was running on the playground and tripped over a toy truck.',
      injury_description: '2',
      action_taken: '2',
      is_bite: false,
      is_peer_aggression: false
    };
    
    // Log the request
    logEntry({
      type: 'request',
      timestamp: new Date().toISOString(),
      request: testData
    });
    
    // Send directly to n8n
    console.log(`Sending request to ${N8N_URL}`);
    const response = await axios.post(N8N_URL, testData);
    
    // Log the response
    logEntry({
      type: 'response',
      timestamp: new Date().toISOString(),
      response: response.data
    });
    
    console.log('Test completed successfully');
    res.json({ status: 'success', message: 'Test completed' });
  } catch (error) {
    console.error('Error running test:', error.message);
    res.status(500).json({ error: 'Error running test' });
  }
});

app.post('/api/test/adequate', async (req, res) => {
  console.log('Running adequate report test...');
  
  try {
    // Define test data
    const testData = {
      child_id: 'child123',
      child_name: 'Test Child',
      injury_time_eastern: '2025-04-17 11:30 AM EDT',
      location: 'Playground',
      submitting_user_id: 'teacher456',
      incident_description: 'Child was running on the playground and tripped over a toy truck.',
      injury_description: 'Small scrape on left knee, about 1 inch long with minor redness.',
      action_taken: 'Cleaned the area with soap and water, applied a bandage, and comforted the child by reading a book together.',
      is_bite: false,
      is_peer_aggression: false
    };
    
    // Log the request
    logEntry({
      type: 'request',
      timestamp: new Date().toISOString(),
      request: testData
    });
    
    // Send directly to n8n
    console.log(`Sending request to ${N8N_URL}`);
    const response = await axios.post(N8N_URL, testData);
    
    // Log the response
    logEntry({
      type: 'response',
      timestamp: new Date().toISOString(),
      response: response.data
    });
    
    console.log('Test completed successfully');
    res.json({ status: 'success', message: 'Test completed' });
  } catch (error) {
    console.error('Error running test:', error.message);
    res.status(500).json({ error: 'Error running test' });
  }
});

// Serve the logs directory
app.use('/logs', express.static(LOG_DIR));

// API endpoint to get log files
app.get('/api/logs', (req, res) => {
  const logs = fs.readdirSync(LOG_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      filename: file,
      url: `/logs/${file}`,
      created: fs.statSync(path.join(LOG_DIR, file)).birthtime
    }))
    .sort((a, b) => new Date(b.created) - new Date(a.created));
  
  res.json(logs);
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
  console.log(`Logs will be saved to: ${LOG_FILE}`);
  console.log(`View logs at: http://localhost:${PORT}/logs`);
});
