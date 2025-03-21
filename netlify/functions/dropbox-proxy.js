// netlify/functions/dropbox-proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  const dropboxUrl = event.queryStringParameters.url;
  if (!dropboxUrl) {
    return { 
      statusCode: 400, 
      body: 'Missing Dropbox URL',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
  
  try {
    // Convert to direct download link
    const directDownloadUrl = dropboxUrl.replace('dl=0', 'dl=1');
    
    const response = await fetch(directDownloadUrl);
    
    if (!response.ok) {
      return { 
        statusCode: response.status, 
        body: `Dropbox returned error: ${response.status} ${response.statusText}`,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
    
    const content = await response.text();
    
    return {
      statusCode: 200,
      body: content,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error details:', error);
    return { 
      statusCode: 500, 
      body: `Error accessing Dropbox file: ${error.message}`,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};