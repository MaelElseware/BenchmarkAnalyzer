// Dialog for sharing benchmark results from within the analyzer

import React, { useState } from 'react';
import { uploadBenchmarkData, getShareableUrl } from '../services/firebase';
import './ShareDialog.css';

const ShareDialog = ({ benchmarkData, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate shareable link
  const generateLink = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      // Upload the data to Firebase
      const benchmarkId = await uploadBenchmarkData(benchmarkData);
      
      // Generate shareable URL
      const url = getShareableUrl(benchmarkId);
      setShareableLink(url);
    } catch (err) {
      console.error("Error generating link:", err);
      setError(`Failed to generate link: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="share-dialog-overlay">
      <div className="share-dialog">
        <div className="share-dialog-header">
          <h2>Share Benchmark Results</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="share-dialog-content">
          <p>
            Generate a shareable link for your benchmark results. 
            This link will be valid for 30 days.
          </p>
          
          {!shareableLink && (
            <button 
              className="generate-button" 
              onClick={generateLink} 
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Shareable Link'}
            </button>
          )}
          
          {shareableLink && (
            <div className="share-link-container">
              <input 
                type="text" 
                value={shareableLink} 
                readOnly 
                className="share-link-input" 
                onClick={e => e.target.select()}
              />
              <button 
                className="copy-button" 
                onClick={copyToClipboard}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
          
          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;