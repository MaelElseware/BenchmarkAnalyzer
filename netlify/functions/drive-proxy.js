// Updated netlify/functions/drive-proxy.js with detailed logging
const axios = require('axios');

exports.handler = async function(event) {
  console.log('Received request with params:', event.queryStringParameters);
  
  // Get the file ID from the request
  const fileId = event.queryStringParameters.id;
  if (!fileId) {
    console.log('Missing file ID in request');
    return { statusCode: 400, body: 'Missing file ID' };
  }
  
  try {
    // Use the updated Google Drive URL format
    const driveUrl = `https://drive.usercontent.google.com/u/0/uc?id=${fileId}&export=download`;
    console.log('Fetching from URL:', driveUrl);
    
    // Request the file with proper handling of redirects and cookies
    const response = await axios.get(driveUrl, {
      maxRedirects: 5,
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data snippet:', response.data.substring(0, 200));
    
    // (rest of the function remains the same)
  } catch (error) {
    console.log('Error details:', error);
    
    // More detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.log('Request setup error:', error.message);
    }
    
    return { 
      statusCode: 500, 
      body: `Error accessing Google Drive file: ${error.message}`,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};