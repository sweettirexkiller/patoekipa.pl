module.exports = async function (context, req) {
  context.log('Test function called');

  // Set CORS headers
  context.res = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    return;
  }

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      message: 'Azure Functions is working!',
      method: req.method,
      timestamp: new Date().toISOString()
    }
  };
}; 