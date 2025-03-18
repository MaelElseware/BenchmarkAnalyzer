// Standalone utility for quickly sharing benchmark files without analyzing them first

import React, { useState, useRef } from "react";
import BenchmarkStorageService from './services/BenchmarkStorageService';
import './QuickShare.css';

/**
 * A utility component that allows users to quickly upload and share benchmark files
 */
const QuickShare = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    await processFile(file);
  };
  
  // Process the selected file
  const processFile = async (file) => {
    setIsUploading(true);
    setError("");
    setShareableUrl("");
    
    try {
      // Read the file
      const content = await readFileAsText(file);
      
      // Upload and get shareable URL
      const url = await BenchmarkStorageService.saveRawLogAndGetShareableUrl(content, file.name);
      
      // Set the URL for display
      setShareableUrl(url);
    } catch (err) {
      console.error("Error sharing file:", err);
      setError(`Error sharing file: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Read a file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Could not copy text: ", err);
      });
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="quick-share-container">
      <h1 className="title">Benchmark Quick Share</h1>
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="drop-zone-content">
          <div className="upload-icon">📊</div>
          <p>Drag & drop your benchmark log file here</p>
          <p className="or">or</p>
          <button className="select-button">Select File</button>
        </div>
        
        <input
          type="file"
          accept=".log,.txt"
          onChange={handleFileChange}
          className="hidden-input"
          ref={fileInputRef}
        />
      </div>
      
      {isUploading && (
        <div className="loading-indicator">
          <p>Uploading and generating shareable link...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {shareableUrl && (
        <div className="share-result">
          <h2>Your benchmark is ready to share!</h2>
          <p>Anyone with this link can view your benchmark results:</p>
          
          <div className="url-container">
            <input
              type="text"
              value={shareableUrl}
              readOnly
              className="url-input"
              onClick={(e) => e.target.select()}
            />
            <button 
              className="copy-button"
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="open-link">
            <a href={shareableUrl} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
          </div>
        </div>
      )}
      
      <div className="quick-share-footer">
        <p>
          This tool creates a shareable link for your benchmark results that will be valid for 30 days.
        </p>
      </div>
    </div>
  );
};

export default QuickShare;