// Higher-level service that simplifies working with benchmark data

import { uploadBenchmarkData, getBenchmarkData, getShareableUrl } from './firebase';

/**
 * Service to handle benchmark storage and sharing
 */
class BenchmarkStorageService {
  /**
   * Saves the raw log file content and returns a shareable URL
   * @param {string} logContent The raw log file content
   * @param {string} fileName The name of the file
   * @returns {Promise<string>} A shareable URL
   */
  async saveRawLogAndGetShareableUrl(logContent, fileName) {
    try {
      // Package the data
      const data = {
        rawLogContent: logContent,
        fileName: fileName || 'benchmark.log',
        timestamp: new Date().toISOString()
      };
      
      // Upload the data
      const benchmarkId = await uploadBenchmarkData(data);
      
      // Return the shareable URL
      return getShareableUrl(benchmarkId);
    } catch (error) {
      console.error('Error saving benchmark:', error);
      throw error;
    }
  }
  
  /**
   * Saves processed benchmark data and returns a shareable URL
   * @param {Object} benchmarkData The processed benchmark data
   * @returns {Promise<string>} A shareable URL
   */
  async saveProcessedDataAndGetShareableUrl(benchmarkData) {
    try {
      // Upload the data
      const benchmarkId = await uploadBenchmarkData(benchmarkData);
      
      // Return the shareable URL
      return getShareableUrl(benchmarkId);
    } catch (error) {
      console.error('Error saving benchmark:', error);
      throw error;
    }
  }
  
  /**
   * Loads benchmark data from a URL
   * @param {string} url The URL containing the benchmark ID
   * @returns {Promise<Object>} The benchmark data
   */
  async loadFromUrl(url) {
    try {
      // Extract the benchmark ID from the URL
      const urlObj = new URL(url);
      const benchmarkId = urlObj.searchParams.get('benchmark');
      
      if (!benchmarkId) {
        throw new Error('Invalid URL format: No benchmark ID found');
      }
      
      // Load the benchmark data
      return await getBenchmarkData(benchmarkId);
    } catch (error) {
      console.error('Error loading benchmark from URL:', error);
      throw error;
    }
  }
  
  /**
   * Loads benchmark data from an ID
   * @param {string} benchmarkId The benchmark ID
   * @returns {Promise<Object>} The benchmark data
   */
  async loadFromId(benchmarkId) {
    try {
      return await getBenchmarkData(benchmarkId);
    } catch (error) {
      console.error('Error loading benchmark:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new BenchmarkStorageService();