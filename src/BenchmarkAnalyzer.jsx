// 1. use the cd
// 2. npm run deploy to send to githubpage
// 2.1 or npm start to go for a local serv version

import React, { useState, useEffect } from "react";
import './BenchmarkAnalyzer.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ShareDialog from './components/ShareDialog';
import { getBenchmarkData } from './services/firebase';

const BenchmarkAnalyzer = () => {
  // State for application
  const [activeTab, setActiveTab] = useState('evolution');
  const [selectedScene, setSelectedScene] = useState('all');
  const [evolutionData, setEvolutionData] = useState({});
  const [sceneAverages, setSceneAverages] = useState([]);
  const [stutters, setStutters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);

  // Debug utility to log chart data
  const debugChartData = (data, name) => {
    console.log(`Chart data for ${name}:`, data);
    return data;
  };
  
  // Function to parse log file
  const parseLogFile = (logContent) => {
    const benchmarks = [];
    const stutterPattern = /\[(.+?)\] !!! STUTTER !!! ([\d.]+) FPS/g;
    const benchmarkPattern = /\[(.+?)\] (.+?)_(\d+) - Samples: (\d+), Duration: ([\d.]+)s\s+=== FPS STATISTICS ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+Frames < 60 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 45 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 30 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 15 FPS: (\d+) \(([\d.]+)%\)\s+=== GAME THREAD \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+=== RENDER THREAD \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+=== GPU TIME \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)/g;
    
    // Fallback to old pattern if the new one doesn't match
    const oldBenchmarkPattern = /\[.+?\] (.+?)_(\d+) - Samples: (\d+), Duration: ([\d.]+)s\s+MEAN: ([\d.]+)\s+Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+Frames < 60 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 45 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 30 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 15 FPS: (\d+) \(([\d.]+)%\)/g;
    
    let match;
    // Try the new pattern first
    while ((match = benchmarkPattern.exec(logContent)) !== null) {
      benchmarks.push({
        scene: match[2],
        run: parseInt(match[3]),
        samples: parseInt(match[4]),
        duration: parseFloat(match[5]),
        mean: parseFloat(match[6]),
        median: parseFloat(match[7]),
        min: parseFloat(match[8]),
        max: parseFloat(match[9]),
        frames_below_60: parseInt(match[10]),
        percent_below_60: parseFloat(match[11]),
        frames_below_45: parseInt(match[12]),
        percent_below_45: parseFloat(match[13]),
        frames_below_30: parseInt(match[14]),
        percent_below_30: parseFloat(match[15]),
        frames_below_15: parseInt(match[16]),
        percent_below_15: parseFloat(match[17]),
        gameThreadMean: parseFloat(match[18]),    // Note the camelCase property names
        gameThreadMedian: parseFloat(match[19]), 
        gameThreadMin: parseFloat(match[20]),
        gameThreadMax: parseFloat(match[21]),
        renderThreadMean: parseFloat(match[22]),
        renderThreadMedian: parseFloat(match[23]),
        renderThreadMin: parseFloat(match[24]),
        renderThreadMax: parseFloat(match[25]),
        gpuTimeMean: parseFloat(match[26]),
        gpuTimeMedian: parseFloat(match[27]),
        gpuTimeMin: parseFloat(match[28]),
        gpuTimeMax: parseFloat(match[29])
      });
    }
    
    // If no benchmarks found, try the old pattern
    if (benchmarks.length === 0) {
      let oldMatch;
      while ((oldMatch = oldBenchmarkPattern.exec(logContent)) !== null) {
        benchmarks.push({
          scene: oldMatch[1],
          run: parseInt(oldMatch[2]),
          samples: parseInt(oldMatch[3]),
          duration: parseFloat(oldMatch[4]),
          mean: parseFloat(oldMatch[5]),
          median: parseFloat(oldMatch[6]),
          min: parseFloat(oldMatch[7]),
          max: parseFloat(oldMatch[8]),
          frames_below_60: parseInt(oldMatch[9]),
          percent_below_60: parseFloat(oldMatch[10]),
          frames_below_45: parseInt(oldMatch[11]),
          percent_below_45: parseFloat(oldMatch[12]),
          frames_below_30: parseInt(oldMatch[13]),
          percent_below_30: parseFloat(oldMatch[14]),
          frames_below_15: parseInt(oldMatch[15]),
          percent_below_15: parseFloat(oldMatch[16])
        });
      }
    }
    
    const stutters = [];
    let stutterMatch;
    while ((stutterMatch = stutterPattern.exec(logContent)) !== null) {
      stutters.push({
        timestamp: stutterMatch[1],
        fps: parseFloat(stutterMatch[2])
      });
    }
    
    return { benchmarks, stutters };
  };
  
  // Process benchmark data into the format needed for visualization
  const processBenchmarkData = (benchmarks) => {
    // Group benchmarks by scene and then by run
    const grouped = {};
    
    // Group by scene first
    benchmarks.forEach(benchmark => {
      if (!grouped[benchmark.scene]) {
        grouped[benchmark.scene] = [];
      }
      
      grouped[benchmark.scene].push({
        run: benchmark.run,
        mean: benchmark.mean,
        median: benchmark.median,
        min: benchmark.min,
        max: benchmark.max,
        below60: benchmark.percent_below_60,
        below45: benchmark.percent_below_45,
        below30: benchmark.percent_below_30,
        below15: benchmark.percent_below_15,
        samples: benchmark.samples,
        gameThreadMean: benchmark.gameThreadMean,
        gameThreadMedian: benchmark.gameThreadMedian,
        gameThreadMin: benchmark.gameThreadMin,
        gameThreadMax: benchmark.gameThreadMax,
        renderThreadMean: benchmark.renderThreadMean,
        renderThreadMedian: benchmark.renderThreadMedian,
        renderThreadMin: benchmark.renderThreadMin,
        renderThreadMax: benchmark.renderThreadMax,
        gpuTimeMean: benchmark.gpuTimeMean,
        gpuTimeMedian: benchmark.gpuTimeMedian,
        gpuTimeMin: benchmark.gpuTimeMin,
        gpuTimeMax: benchmark.gpuTimeMax
      });
    });
    
    // Sort runs within each scene
    Object.keys(grouped).forEach(scene => {
      grouped[scene].sort((a, b) => a.run - b.run);
    });
    
    // Calculate proper averages for each scene (across all runs)
    const averages = Object.keys(grouped).map(scene => {
      const runs = grouped[scene];
      const totalSamples = runs.reduce((sum, run) => sum + (run.samples || 1), 0);
      
      // Weight means and medians by sample count for more accurate averaging
      const weightedMean = runs.reduce((sum, run) => sum + (run.mean * (run.samples || 1)), 0) / totalSamples;
      const weightedMedian = runs.reduce((sum, run) => sum + (run.median * (run.samples || 1)), 0) / totalSamples;
      
      // Find min and max of the mean FPS values across runs
      const minMeanFPS = Math.min(...runs.map(run => run.mean));
      const maxMeanFPS = Math.max(...runs.map(run => run.mean));
      
      // Calculate thread time and GPU time averages
      const hasThreadData = runs.some(run => run.gameThreadMean !== undefined);
      
      let gameThreadMean = 0;
      let minGameThreadMean = 0;
      let maxGameThreadMean = 0;
      let renderThreadMean = 0;
      let minRenderThreadMean = 0;
      let maxRenderThreadMean = 0;
      let gpuTimeMean = 0;
      let minGpuTimeMean = 0;
      let maxGpuTimeMean = 0;
      
      if (hasThreadData) {
        // Calculate weighted average for thread times
        gameThreadMean = runs.reduce((sum, run) => sum + ((run.gameThreadMean || 0) * (run.samples || 1)), 0) / totalSamples;
        minGameThreadMean = Math.min(...runs.map(run => run.gameThreadMean || Number.MAX_VALUE));
        maxGameThreadMean = Math.max(...runs.map(run => run.gameThreadMean || 0));
        
        renderThreadMean = runs.reduce((sum, run) => sum + ((run.renderThreadMean || 0) * (run.samples || 1)), 0) / totalSamples;
        minRenderThreadMean = Math.min(...runs.map(run => run.renderThreadMean || Number.MAX_VALUE));
        maxRenderThreadMean = Math.max(...runs.map(run => run.renderThreadMean || 0));
        
        gpuTimeMean = runs.reduce((sum, run) => sum + ((run.gpuTimeMean || 0) * (run.samples || 1)), 0) / totalSamples;
        minGpuTimeMean = Math.min(...runs.map(run => run.gpuTimeMean || Number.MAX_VALUE));
        maxGpuTimeMean = Math.max(...runs.map(run => run.gpuTimeMean || 0));
      }
      
      return {
        name: scene,
        meanFPS: weightedMean,
        medianFPS: weightedMedian,
        minFPS: Math.min(...runs.map(run => run.min)),
        maxFPS: Math.max(...runs.map(run => run.max)),
        minMeanFPS: minMeanFPS,
        maxMeanFPS: maxMeanFPS,
        gameThreadMean: gameThreadMean,
        minGameThreadMean: minGameThreadMean === Number.MAX_VALUE ? 0 : minGameThreadMean,
        maxGameThreadMean: maxGameThreadMean,
        renderThreadMean: renderThreadMean,
        minRenderThreadMean: minRenderThreadMean === Number.MAX_VALUE ? 0 : minRenderThreadMean,
        maxRenderThreadMean: maxRenderThreadMean,
        gpuTimeMean: gpuTimeMean,
        minGpuTimeMean: minGpuTimeMean === Number.MAX_VALUE ? 0 : minGpuTimeMean,
        maxGpuTimeMean: maxGpuTimeMean,
        below60: runs.reduce((sum, run) => sum + (run.below60 * (run.samples || 1)), 0) / totalSamples,
        below45: runs.reduce((sum, run) => sum + (run.below45 * (run.samples || 1)), 0) / totalSamples,
        below30: runs.reduce((sum, run) => sum + (run.below30 * (run.samples || 1)), 0) / totalSamples,
        below15: runs.reduce((sum, run) => sum + (run.below15 * (run.samples || 1)), 0) / totalSamples,
        totalSamples: totalSamples,
        hasThreadData: hasThreadData
      };
    });
    
    return { evolution: grouped, averages };
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError('');
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        processLogContent(content, file.name);
      } catch (err) {
        console.error('Error processing file:', err);
        setError('Error processing the file. Make sure it has the correct format.');
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
      setLoading(false);
    };
    reader.readAsText(file);
  };
  
  const processLogContent = (content, fileName) => {
    try {
      const { benchmarks, stutters } = parseLogFile(content);
      
      if (benchmarks.length === 0) {
        setError('No benchmark data found in the file. Make sure it has the correct format.');
        setLoading(false);
        return;
      }
      
      const { evolution, averages } = processBenchmarkData(benchmarks);
      setEvolutionData(evolution);
      setSceneAverages(averages);
      setStutters(stutters);
      setFileName(fileName);
      
      // Set default selected scene
      if (Object.keys(evolution).length > 0) {
        setSelectedScene('all');
      }
      
      setLoading(false);
      setIsLoadingShared(false);
    } catch (err) {
      console.error('Error processing content:', err);
      setError('Error processing the data. Make sure it has the correct format.');
      setLoading(false);
      setIsLoadingShared(false);
    }
  };
  
  // Handle loading shared benchmark from URL
  const loadSharedBenchmark = async (benchmarkId) => {
    setIsLoadingShared(true);
    setError('');
    
    try {
      const data = await getBenchmarkData(benchmarkId);
      
      if (data.rawLogContent) {
        // Process the raw log content
        processLogContent(data.rawLogContent, data.fileName || 'Shared Benchmark');
      } else if (data.evolutionData && data.sceneAverages) {
        // Directly use processed data if available
        setEvolutionData(data.evolutionData);
        setSceneAverages(data.sceneAverages);
        setStutters(data.stutters || []);
        setFileName(data.fileName || 'Shared Benchmark');
        setSelectedScene('all');
        setLoading(false);
        setIsLoadingShared(false);
      } else {
        throw new Error('Invalid benchmark data format');
      }
    } catch (err) {
      console.error('Error loading shared benchmark:', err);
      setError(`Failed to load shared benchmark: ${err.message}`);
      setIsLoadingShared(false);
    }
  };
  
  // Prepare data for sharing
  const prepareBenchmarkDataForSharing = () => {
    return {
      evolutionData,
      sceneAverages,
      stutters,
      fileName,
      sharedAt: new Date().toISOString(),
    };
  };
  
  // Toggle share dialog
  const toggleShareDialog = () => {
    setIsSharing(!isSharing);
  };

  // Sample data function for demonstration purposes
  const getSampleData = () => {
    // Sample evolution data structure
    const evolution = {
      "Blockade1": [
        { 
          run: 0, 
          mean: 65.13, 
          median: 64.53, 
          min: 14.13, 
          max: 100.62, 
          below60: 29.2, 
          below45: 3.8, 
          below30: 1.7, 
          below15: 0.2, 
          samples: 895,
          gameThreadMean: 11.90,
          gameThreadMedian: 11.44,
          gameThreadMin: 8.28,
          gameThreadMax: 23.70,
          renderThreadMean: 5.20,
          renderThreadMedian: 4.82,
          renderThreadMin: 3.68,
          renderThreadMax: 40.06,
          gpuTimeMean: 14.12,
          gpuTimeMedian: 13.85,
          gpuTimeMin: 10.05,
          gpuTimeMax: 32.24
        },
        { 
          run: 1, 
          mean: 51.48, 
          median: 51.91, 
          min: 12.03, 
          max: 62.07, 
          below60: 99.0, 
          below45: 6.3, 
          below30: 0.4, 
          below15: 0.4, 
          samples: 735,
          gameThreadMean: 12.80,
          gameThreadMedian: 12.10,
          gameThreadMin: 8.50,
          gameThreadMax: 25.30,
          renderThreadMean: 5.60,
          renderThreadMedian: 5.12,
          renderThreadMin: 3.95,
          renderThreadMax: 42.15,
          gpuTimeMean: 15.20,
          gpuTimeMedian: 14.75,
          gpuTimeMin: 10.85,
          gpuTimeMax: 34.50
        }
      ],
      "Slump": [
        { 
          run: 0, 
          mean: 77.79, 
          median: 80.49, 
          min: 17.24, 
          max: 114.48, 
          below60: 9.3, 
          below45: 2.1, 
          below30: 0.8, 
          below15: 0.0, 
          samples: 1077,
          gameThreadMean: 8.66,
          gameThreadMedian: 8.62,
          gameThreadMin: 6.86,
          gameThreadMax: 15.63,
          renderThreadMean: 4.37,
          renderThreadMedian: 4.12,
          renderThreadMin: 3.67,
          renderThreadMax: 15.84,
          gpuTimeMean: 11.80,
          gpuTimeMedian: 11.06,
          gpuTimeMin: 8.87,
          gpuTimeMax: 38.35
        },
        { 
          run: 1, 
          mean: 54.27, 
          median: 54.27, 
          min: 13.62, 
          max: 62.18, 
          below60: 98.0, 
          below45: 0.6, 
          below30: 0.1, 
          below15: 0.1, 
          samples: 783,
          gameThreadMean: 9.20,
          gameThreadMedian: 9.05,
          gameThreadMin: 7.12,
          gameThreadMax: 17.25,
          renderThreadMean: 4.75,
          renderThreadMedian: 4.45,
          renderThreadMin: 3.80,
          renderThreadMax: 16.75,
          gpuTimeMean: 12.50,
          gpuTimeMedian: 11.85,
          gpuTimeMin: 9.10,
          gpuTimeMax: 40.20
        }
      ]
    };

    // Calculate averages based on our sample data
    const averages = Object.keys(evolution).map(scene => {
      const runs = evolution[scene];
      const totalSamples = runs.reduce((sum, run) => sum + run.samples, 0);
      
      const weightedMean = runs.reduce((sum, run) => sum + (run.mean * run.samples), 0) / totalSamples;
      const weightedMedian = runs.reduce((sum, run) => sum + (run.median * run.samples), 0) / totalSamples;
      
      // Find min and max of the mean FPS values across runs
      const minMeanFPS = Math.min(...runs.map(run => run.mean));
      const maxMeanFPS = Math.max(...runs.map(run => run.mean));
      
      // Calculate thread time and GPU time averages
      const gameThreadMean = runs.reduce((sum, run) => sum + (run.gameThreadMean * run.samples), 0) / totalSamples;
      const minGameThreadMean = Math.min(...runs.map(run => run.gameThreadMean));
      const maxGameThreadMean = Math.max(...runs.map(run => run.gameThreadMean));
      
      const renderThreadMean = runs.reduce((sum, run) => sum + (run.renderThreadMean * run.samples), 0) / totalSamples;
      const minRenderThreadMean = Math.min(...runs.map(run => run.renderThreadMean));
      const maxRenderThreadMean = Math.max(...runs.map(run => run.renderThreadMean));
      
      const gpuTimeMean = runs.reduce((sum, run) => sum + (run.gpuTimeMean * run.samples), 0) / totalSamples;
      const minGpuTimeMean = Math.min(...runs.map(run => run.gpuTimeMean));
      const maxGpuTimeMean = Math.max(...runs.map(run => run.gpuTimeMean));
      
      return {
        name: scene,
        meanFPS: weightedMean,
        medianFPS: weightedMedian,
        minFPS: Math.min(...runs.map(run => run.min)),
        maxFPS: Math.max(...runs.map(run => run.max)),
        minMeanFPS: minMeanFPS,
        maxMeanFPS: maxMeanFPS,
        gameThreadMean: gameThreadMean,
        minGameThreadMean: minGameThreadMean,
        maxGameThreadMean: maxGameThreadMean,
        renderThreadMean: renderThreadMean,
        minRenderThreadMean: minRenderThreadMean,
        maxRenderThreadMean: maxRenderThreadMean,
        gpuTimeMean: gpuTimeMean,
        minGpuTimeMean: minGpuTimeMean,
        maxGpuTimeMean: maxGpuTimeMean,
        below60: runs.reduce((sum, run) => sum + (run.below60 * run.samples), 0) / totalSamples,
        below45: runs.reduce((sum, run) => sum + (run.below45 * run.samples), 0) / totalSamples,
        below30: runs.reduce((sum, run) => sum + (run.below30 * run.samples), 0) / totalSamples,
        below15: runs.reduce((sum, run) => sum + (run.below15 * run.samples), 0) / totalSamples,
        totalSamples: totalSamples,
        hasThreadData: true
      };
    });
    
    // Sample stutter events
    const stutters = [
      { timestamp: "2025-03-10 18:32:15", fps: 9.91 },
      { timestamp: "2025-03-10 18:32:31", fps: 9.61 },
      { timestamp: "2025-03-10 18:33:51", fps: 9.65 }
    ];
    
    return { evolution, averages, stutters };
  };

  // Function to format FPS with color
  const formatFPS = (fps) => {
    if (fps >= 60) {
      return <span className="good-fps">{fps.toFixed(2)}</span>;
    } else if (fps >= 45) {
      return <span className="average-fps">{fps.toFixed(2)}</span>;
    } else if (fps >= 30) {
      return <span className="poor-fps">{fps.toFixed(2)}</span>;
    } else {
      return <span className="bad-fps">{fps.toFixed(2)}</span>;
    }
  };
    // Prepare data for evolution chart
    const prepareEvolutionChartData = () => {
      if (!evolutionData || Object.keys(evolutionData).length === 0) {
        return [];
      }
      
      if (selectedScene === 'all') {
        // Return data for all scenes
        const allScenesData = Object.keys(evolutionData).map(scene => {
          return evolutionData[scene].map(run => ({
            run: `Run ${run.run}`,
            [scene]: run.mean
          }));
        }).flat().reduce((result, item) => {
          const existingItem = result.find(r => r.run === item.run);
          if (existingItem) {
            return result.map(r => r.run === item.run ? { ...r, ...item } : r);
          }
          return [...result, item];
        }, []).sort((a, b) => {
          const runA = parseInt(a.run.split(' ')[1]);
          const runB = parseInt(b.run.split(' ')[1]);
          return runA - runB;
        });
        
        console.log("All Scenes Data:", allScenesData);
        return allScenesData;
      } else {
        // Return data just for the selected scene
        const sceneData = evolutionData[selectedScene] ? evolutionData[selectedScene].map(run => ({
          run: `Run ${run.run}`,
          mean: run.mean,
          median: run.median,
          min: run.min,
          max: run.max
        })) : [];
        
        console.log("Scene Data for", selectedScene, ":", sceneData);
        return sceneData;
      }
    };
    
    // Prepare data for thread time comparison chart when all scenes are selected
    const prepareThreadComparisonData = () => {
      if (!sceneAverages || sceneAverages.length === 0 || !sceneAverages[0].hasThreadData) {
        return [];
      }
      
      return sceneAverages.map(scene => ({
        name: scene.name,
        gameThread: scene.gameThreadMean || 0,
        renderThread: scene.renderThreadMean || 0, 
        gpuTime: scene.gpuTimeMean || 0
      }));
    };
    
    // Load sample data on mount
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const benchmarkId = params.get('benchmark');
      
      if (benchmarkId) {
        // Load the shared benchmark
        loadSharedBenchmark(benchmarkId);
      } else {
        // Load sample data for demonstration if no benchmark is specified
        const sampleData = getSampleData();
        setEvolutionData(sampleData.evolution);
        setSceneAverages(sampleData.averages);
        setStutters(sampleData.stutters);
        setFileName('Sample Data (Demo)');
      }
    }, []);

    useEffect(() => {
      // Force re-render of charts after component has mounted
      if (Object.keys(evolutionData).length > 0) {
        const timer = setTimeout(() => {
          // Force a slight state change to trigger re-render
          setEvolutionData({...evolutionData});
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [evolutionData]);
    
    const evolutionChartData = prepareEvolutionChartData();
  
    if (loading || isLoadingShared) {
      return (
        <div className="benchmark-container">
          <div className="loading">Loading benchmark data...</div>
        </div>
      );
    }
  
  return (
    <div className="benchmark-container">
      <h1 className="title">Benchmark Performance Analyzer</h1>
      
      {/* File Upload */}
      <div className="section">
        <h2 className="subtitle">Load Benchmark Data</h2>
        
        <div className="controls-row">
          <div>
            <label className="upload-button">
              Upload Log File
              <input 
                type="file" 
                accept=".log,.txt" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
            <span className="filename">
              {fileName ? `Current file: ${fileName}` : 'No file selected'}
            </span>
          </div>

          {/* Share Button */}
          {Object.keys(evolutionData).length > 0 && (
          <button 
            className="share-button" 
            onClick={toggleShareDialog}
          >
            Share Results
          </button>
          )}
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
          onClick={() => setActiveTab('evolution')}
        >
          Performance Evolution
        </button>
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
      </div>
      
      {/* Empty State */}
      {Object.keys(evolutionData).length === 0 && !loading && (
        <div className="section empty-state">
          <h2 className="subtitle">No Data Available</h2>
          <p>Please upload a benchmark log file to visualize performance data.</p>
        </div>
      )}

      {/* Evolution Tab */}
      {activeTab === 'evolution' && Object.keys(evolutionData).length > 0 && (
        <div>
          <div className="section">
            <h2 className="subtitle">Performance Evolution Over Runs</h2>
            
            {/* Scene selector */}
            <div className="selector-container">
              <label htmlFor="scene-select" className="selector-label">Select Scene:</label>
              <select
                id="scene-select"
                className="scene-selector"
                value={selectedScene}
                onChange={(e) => setSelectedScene(e.target.value)}
              >
                <option value="all">All Scenes</option>
                {Object.keys(evolutionData).map(scene => (
                  <option key={scene} value={scene}>{scene}</option>
                ))}
              </select>
            </div>
            
            {/* Evolution Chart */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                {selectedScene === 'all' ? (
                  <LineChart data={evolutionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="run" />
                    <YAxis domain={[0, 'dataMax + 10']} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(evolutionData).map((scene, index) => (
                      <Line 
                        key={scene}
                        type="monotone" 
                        dataKey={scene} 
                        name={scene} 
                        stroke={
                          index === 0 ? '#8884d8' : 
                          index === 1 ? '#82ca9d' : 
                          index === 2 ? '#ffc658' :
                          index === 3 ? '#ff7300' :
                          '#0088FE'
                        } 
                      />
                    ))}
                  </LineChart>
                ) : (
                  <LineChart data={evolutionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="run" />
                    <YAxis domain={[0, 'dataMax + 10']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mean" name="Mean FPS" stroke="#8884d8" />
                    <Line type="monotone" dataKey="median" name="Median FPS" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="min" name="Min FPS" stroke="#ff7300" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="max" name="Max FPS" stroke="#0088FE" strokeDasharray="3 3" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Thread Time Comparison Chart for all scenes */}
          {selectedScene === 'all' && sceneAverages.some(scene => scene.hasThreadData) && (
            <div className="section mt-4">
              <h2 className="subtitle">Thread Time Comparison Across Scenes (ms)</h2>
              <div className="chart-container" style={{ height: '450px', marginBottom: '40px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={prepareThreadComparisonData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                          formatter={(value) => value.toFixed(2)} 
                    />
                    <Legend wrapperStyle={{ position: 'relative', marginTop: '10px' }} />
                    <Bar dataKey="gameThread" name="Game Thread" fill="#8884d8" />
                    <Bar dataKey="renderThread" name="Render Thread" fill="#82ca9d" />
                    <Bar dataKey="gpuTime" name="GPU Time" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Additional Performance Metrics if present - Fixed to always show charts when a scene is selected */}
          {selectedScene !== 'all' && evolutionData[selectedScene] && (
            <div className="section">
              <h2 className="subtitle">Performance Metrics for {selectedScene}</h2>
              <div className="metrics-grid">
                {/* Game Thread Time Chart - Fixed */}
                <div className="metric-card">
                  <h3 className="metric-title">Game Thread Time (ms)</h3>
                  <div className=".chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={debugChartData(evolutionData[selectedScene].map(run => ({
                          run: `Run ${run.run}`,
                          mean: run.gameThreadMean || 0,
                          median: run.gameThreadMedian || 0,
                          min: run.gameThreadMin || 0,
                          max: run.gameThreadMax || 0
                        })), 'Game Thread')}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="run" />
                        <YAxis domain={[0, 'dataMax + 5']} />
                        <Tooltip 
                          formatter={(value) => value.toFixed(2)} 
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="mean" name="Mean Time" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="median" name="Median Time" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="min" name="Min Time" stroke="#ff7300" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="max" name="Max Time" stroke="#0088FE" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Render Thread Time Chart - Fixed */}
                <div className="metric-card">
                  <h3 className="metric-title">Render Thread Time (ms)</h3>
                  <div className=".chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={debugChartData(evolutionData[selectedScene].map(run => ({
                          run: `Run ${run.run}`,
                          mean: run.renderThreadMean || 0,
                          median: run.renderThreadMedian || 0,
                          min: run.renderThreadMin || 0,
                          max: run.renderThreadMax || 0
                        })), 'Render Thread')}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="run" />
                        <YAxis domain={[0, 'dataMax + 5']} />
                        <Tooltip 
                          formatter={(value) => value.toFixed(2)} 
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="mean" name="Mean Time" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="median" name="Median Time" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="min" name="Min Time" stroke="#ff7300" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="max" name="Max Time" stroke="#0088FE" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* GPU Time Chart - Fixed */}
                <div className="metric-card">
                  <h3 className="metric-title">GPU Time (ms)</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={debugChartData(evolutionData[selectedScene].map(run => ({
                          run: `Run ${run.run}`,
                          mean: run.gpuTimeMean || 0,
                          median: run.gpuTimeMedian || 0,
                          min: run.gpuTimeMin || 0,
                          max: run.gpuTimeMax || 0
                        })), 'GPU Time')}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="run" />
                        <YAxis domain={[0, 'dataMax + 5']} />
                        <Tooltip 
                          formatter={(value) => value.toFixed(2)} 
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="mean" name="Mean Time" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="median" name="Median Time" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="min" name="Min Time" stroke="#ff7300" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="max" name="Max Time" stroke="#0088FE" strokeDasharray="3 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Share Dialog */}
          {isSharing && (
          <ShareDialog
            benchmarkData={prepareBenchmarkDataForSharing()}
            onClose={toggleShareDialog}
          />
          )}

          {/* Evolution Tables */}
          <div className="section">
            <h2 className="subtitle">Performance Metrics Across Runs</h2>
            
            {Object.keys(evolutionData).map(scene => (
              <div key={scene} className="scene-metrics">
                <h3 className="scene-title">{scene}</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        {evolutionData[scene].map(run => (
                          <th key={run.run}>Run {run.run}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="metric-name">Mean FPS</td>
                        {evolutionData[scene].map(run => (
                          <td key={run.run} className="metric-value">{formatFPS(run.mean)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="metric-name">Median FPS</td>
                        {evolutionData[scene].map(run => (
                          <td key={run.run} className="metric-value">{formatFPS(run.median)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="metric-name">Min FPS</td>
                        {evolutionData[scene].map(run => (
                          <td key={run.run} className="metric-value bad-fps">{run.min.toFixed(2)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="metric-name">Max FPS</td>
                        {evolutionData[scene].map(run => (
                          <td key={run.run} className="metric-value good-fps">{run.max.toFixed(2)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="metric-name">Frames &lt; 60 FPS (%)</td>
                        {evolutionData[scene].map(run => (
                          <td key={run.run} className="metric-value">{run.below60.toFixed(1)}%</td>
                        ))}
                      </tr>
                      {evolutionData[scene][0].gameThreadMean !== undefined && (
                        <>
                          <tr>
                            <td className="metric-name">Game Thread (ms)</td>
                            {evolutionData[scene].map(run => (
                              <td key={run.run} className="metric-value">{run.gameThreadMean?.toFixed(2) || 'N/A'}</td>
                            ))}
                          </tr>
                          <tr>
                            <td className="metric-name">Render Thread (ms)</td>
                            {evolutionData[scene].map(run => (
                              <td key={run.run} className="metric-value">{run.renderThreadMean?.toFixed(2) || 'N/A'}</td>
                            ))}
                          </tr>
                          <tr>
                            <td className="metric-name">GPU Time (ms)</td>
                            {evolutionData[scene].map(run => (
                              <td key={run.run} className="metric-value">{run.gpuTimeMean?.toFixed(2) || 'N/A'}</td>
                            ))}
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Overview Tab */}
      {activeTab === 'overview' && Object.keys(evolutionData).length > 0 && (
        <div>
          <div className="section">
            <h2 className="subtitle">Benchmark Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-label">Overall Average FPS</div>
                <div className="summary-value">
                  {(sceneAverages.reduce((sum, scene) => sum + (scene.meanFPS * scene.totalSamples), 0) / 
                    sceneAverages.reduce((sum, scene) => sum + scene.totalSamples, 0)).toFixed(2)}
                </div>
                <div className="summary-note">Weighted average across all samples</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">FPS Range</div>
                <div className="summary-value">
                  <span className="bad-fps">
                    {Math.min(...sceneAverages.map(scene => scene.minFPS)).toFixed(2)}
                  </span> - 
                  <span className="good-fps">
                    {Math.max(...sceneAverages.map(scene => scene.maxFPS)).toFixed(2)}
                  </span>
                </div>
                <div className="summary-note">Min/max across all scenes and runs</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Stutter Events</div>
                <div className="summary-value bad-fps">{stutters.length}</div>
                <div className="summary-note">FPS drops below 15 FPS</div>
              </div>
            </div>
          </div>
          
          <div className="section">
            <h2 className="subtitle">Performance Metrics by Scene</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3 className="metric-title">Mean FPS Range</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sceneAverages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="minMeanFPS" name="Min Mean FPS" fill="#ff7300" />
                      <Bar dataKey="maxMeanFPS" name="Max Mean FPS" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {sceneAverages.some(scene => scene.hasThreadData) && (
                <>
                  <div className="metric-card">
                    <h3 className="metric-title">Game Thread Time (ms)</h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sceneAverages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="minGameThreadMean" name="Min Game Thread" fill="#82ca9d" />
                          <Bar dataKey="maxGameThreadMean" name="Max Game Thread" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h3 className="metric-title">Render Thread Time (ms)</h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sceneAverages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="minRenderThreadMean" name="Min Render Thread" fill="#82ca9d" />
                          <Bar dataKey="maxRenderThreadMean" name="Max Render Thread" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h3 className="metric-title">GPU Time (ms)</h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sceneAverages}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="minGpuTimeMean" name="Min GPU Time" fill="#82ca9d" />
                          <Bar dataKey="maxGpuTimeMean" name="Max GPU Time" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="section">
            <h2 className="subtitle">Scene Performance Summary</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Scene</th>
                    <th>Mean FPS</th>
                    <th>Median FPS</th>
                    <th>Min FPS</th>
                    <th>Max FPS</th>
                    <th>Frames &lt; 60 FPS</th>
                    {sceneAverages.some(scene => scene.hasThreadData) && (
                      <>
                        <th>Game Thread (ms)</th>
                        <th>Render Thread (ms)</th>
                        <th>GPU Time (ms)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sceneAverages.map((scene, index) => (
                    <tr key={index}>
                      <td>{scene.name}</td>
                      <td>{formatFPS(scene.meanFPS)}</td>
                      <td>{formatFPS(scene.medianFPS)}</td>
                      <td className="bad-fps">{scene.minFPS.toFixed(2)}</td>
                      <td className="good-fps">{scene.maxFPS.toFixed(2)}</td>
                      <td>{scene.below60.toFixed(1)}%</td>
                      {scene.hasThreadData && (
                        <>
                          <td>{scene.gameThreadMean?.toFixed(2) || 'N/A'}</td>
                          <td>{scene.renderThreadMean?.toFixed(2) || 'N/A'}</td>
                          <td>{scene.gpuTimeMean?.toFixed(2) || 'N/A'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Stutter Events */}
          {stutters.length > 0 && (
            <div className="section">
              <h2 className="subtitle">Stutter Events</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>FPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stutters.map((stutter, index) => (
                      <tr key={index} className="stutter-row">
                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {stutter.timestamp.replace(/(\d{2}):(\d{2}):(\d{2})/, '$1:$2:$3 ')}
                        </td>
                        <td className="bad-fps">{stutter.fps.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BenchmarkAnalyzer;