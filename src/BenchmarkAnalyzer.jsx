import React, { useState, useEffect } from "react";
import './BenchmarkAnalyzer.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  
  // Function to parse log file
  const parseLogFile = (logContent) => {
    const benchmarks = [];
    const stutterPattern = /\[(.+?)\] !!! STUTTER !!! ([\d.]+) FPS/g;
    const benchmarkPattern = /\[.+?\] (.+?)_(\d+) - Samples: (\d+), Duration: ([\d.]+)s\s+MEAN: ([\d.]+)\s+Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+Frames < 60 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 45 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 30 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 15 FPS: (\d+) \(([\d.]+)%\)/g;
    
    let match;
    while ((match = benchmarkPattern.exec(logContent)) !== null) {
      benchmarks.push({
        scene: match[1],
        run: parseInt(match[2]),
        samples: parseInt(match[3]),
        duration: parseFloat(match[4]),
        mean: parseFloat(match[5]),
        median: parseFloat(match[6]),
        min: parseFloat(match[7]),
        max: parseFloat(match[8]),
        frames_below_60: parseInt(match[9]),
        percent_below_60: parseFloat(match[10]),
        frames_below_45: parseInt(match[11]),
        percent_below_45: parseFloat(match[12]),
        frames_below_30: parseInt(match[13]),
        percent_below_30: parseFloat(match[14]),
        frames_below_15: parseInt(match[15]),
        percent_below_15: parseFloat(match[16])
      });
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
        samples: benchmark.samples
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
      
      return {
        name: scene,
        meanFPS: weightedMean,
        medianFPS: weightedMedian,
        minFPS: Math.min(...runs.map(run => run.min)),
        maxFPS: Math.max(...runs.map(run => run.max)),
        minMeanFPS: minMeanFPS,
        maxMeanFPS: maxMeanFPS,
        below60: runs.reduce((sum, run) => sum + (run.below60 * (run.samples || 1)), 0) / totalSamples,
        below45: runs.reduce((sum, run) => sum + (run.below45 * (run.samples || 1)), 0) / totalSamples,
        below30: runs.reduce((sum, run) => sum + (run.below30 * (run.samples || 1)), 0) / totalSamples,
        below15: runs.reduce((sum, run) => sum + (run.below15 * (run.samples || 1)), 0) / totalSamples,
        totalSamples: totalSamples
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
        
        // Set default selected scene
        if (Object.keys(evolution).length > 0) {
          setSelectedScene('all');
        }
        
        setLoading(false);
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
  
      // Sample data function for demonstration purposes
  const getSampleData = () => {
    // Sample evolution data structure
    const evolution = {
      "Blockade1": [
        { run: 0, mean: 71.93, median: 74.01, min: 9.61, max: 96.84, below60: 11.4, below45: 2.3, below30: 1.0, below15: 0.9, samples: 983 },
        { run: 1, mean: 51.48, median: 51.91, min: 12.03, max: 62.07, below60: 99.0, below45: 6.3, below30: 0.4, below15: 0.4, samples: 735 },
        { run: 2, mean: 51.52, median: 51.97, min: 12.49, max: 65.79, below60: 98.9, below45: 5.6, below30: 0.4, below15: 0.4, samples: 737 },
      ],
      "Slump": [
        { run: 0, mean: 75.96, median: 77.61, min: 12.49, max: 94.47, below60: 1.5, below45: 0.7, below30: 0.2, below15: 0.2, samples: 1084 },
        { run: 1, mean: 54.27, median: 54.27, min: 13.62, max: 62.18, below60: 98.0, below45: 0.6, below30: 0.1, below15: 0.1, samples: 783 },
        { run: 2, mean: 53.14, median: 53.24, min: 12.50, max: 76.97, below60: 96.6, below45: 3.2, below30: 0.5, below15: 0.5, samples: 758 }
      ],
      "BusStation": [
        { run: 0, mean: 84.20, median: 85.18, min: 12.91, max: 108.22, below60: 1.0, below45: 0.6, below30: 0.1, below15: 0.1, samples: 1198 },
        { run: 1, mean: 53.45, median: 53.70, min: 12.98, max: 76.36, below60: 99.1, below45: 1.8, below30: 0.7, below15: 0.5, samples: 763 },
        { run: 2, mean: 52.04, median: 51.44, min: 12.45, max: 79.55, below60: 81.2, below45: 13.8, below30: 1.9, below15: 1.3, samples: 718 }
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
      
      return {
        name: scene,
        meanFPS: weightedMean,
        medianFPS: weightedMedian,
        minFPS: Math.min(...runs.map(run => run.min)),
        maxFPS: Math.max(...runs.map(run => run.max)),
        minMeanFPS: minMeanFPS,
        maxMeanFPS: maxMeanFPS,
        below60: runs.reduce((sum, run) => sum + (run.below60 * run.samples), 0) / totalSamples,
        below45: runs.reduce((sum, run) => sum + (run.below45 * run.samples), 0) / totalSamples,
        below30: runs.reduce((sum, run) => sum + (run.below30 * run.samples), 0) / totalSamples,
        below15: runs.reduce((sum, run) => sum + (run.below15 * run.samples), 0) / totalSamples,
        totalSamples: totalSamples
      };
    });
    
    // Sample stutter events
    const stutters = [
      { timestamp: "52", fps: 9.91 },
      { timestamp: "73", fps: 9.61 },
      { timestamp: "88", fps: 9.65 }
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
      return Object.keys(evolutionData).map(scene => {
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
    } else {
      // Return data just for the selected scene
      return evolutionData[selectedScene] ? evolutionData[selectedScene].map(run => ({
        run: `Run ${run.run}`,
        mean: run.mean,
        median: run.median,
        min: run.min,
        max: run.max
      })) : [];
    }
  };
  
  // Load sample data on mount
  useEffect(() => {
    // Load sample data for demonstration
    const sampleData = getSampleData();
    setEvolutionData(sampleData.evolution);
    setSceneAverages(sampleData.averages);
    setStutters(sampleData.stutters);
    setFileName('Sample Data (Demo)');
  }, []);
  
  const evolutionChartData = prepareEvolutionChartData();
  
  if (loading) {
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
        
        <div className="upload-container">
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
                <div className="summary-note">FPS drops below 10 FPS</div>
              </div>
            </div>
          </div>
          
          <div className="section">
            <h2 className="subtitle">Mean FPS Range by Scene</h2>
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