exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming request body
    const formData = JSON.parse(event.body);
    
    // Forward to n8n webhook
    const n8nResponse = await fetch('https://primary-production-ffa5b.up.railway.app/webhook-test/9b33e870-2bb0-4c9e-a307-cf3398e8d281', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await n8nResponse.json();

    return {
      statusCode: n8nResponse.status,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error forwarding to n8n:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process form submission',
        details: error.message 
      }),
    };
  }
};