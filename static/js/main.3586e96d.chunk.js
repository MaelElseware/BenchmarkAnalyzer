(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{258:function(e,a,t){e.exports=t(490)},267:function(e,a,t){},268:function(e,a,t){},269:function(e,a,t){},274:function(e,a,t){},490:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),m=t(243),l=t.n(m),c=(t(267),t(268),t(269),t(492)),s=t(493),d=t(494),i=t(103),o=t(104),u=t(48),h=t(66),E=t(256),p=t(495),M=t(106),T=t(244),b=t(67),g=t(57);const y=Object(T.a)({apiKey:"AIzaSyCDjdaZzKUqcc_SkgzwwzWJ11BZFFjTj0Y",authDomain:"unrecordbenchmark.firebaseapp.com",projectId:"unrecordbenchmark",storageBucket:"unrecordbenchmark.firebasestorage.app",messagingSenderId:"1098192714378",appId:"1:1098192714378:web:a2b365606d82f26b1bcb73"}),v=Object(b.b)(y),F=Object(g.e)(y);t(274);var N=e=>{let{benchmarkData:a,onClose:t}=e;const[m,l]=Object(n.useState)(!1),[c,s]=Object(n.useState)(""),[d,i]=Object(n.useState)(""),[o,u]=Object(n.useState)(!1);return r.a.createElement("div",{className:"share-dialog-overlay"},r.a.createElement("div",{className:"share-dialog"},r.a.createElement("div",{className:"share-dialog-header"},r.a.createElement("h2",null,"Share Benchmark Results"),r.a.createElement("button",{className:"close-button",onClick:t},"\xd7")),r.a.createElement("div",{className:"share-dialog-content"},r.a.createElement("p",null,"Generate a shareable link for your benchmark results. This link will be valid for 30 days."),!c&&r.a.createElement("button",{className:"generate-button",onClick:async()=>{l(!0),i("");try{const t=function(e){return`${window.location.origin}${window.location.pathname}?benchmark=${e}`}(await async function(e){try{const a=(await Object(g.a)(Object(g.b)(F,"benchmarks"),{createdAt:Object(g.f)(),fileName:e.fileName||"unknown",expires:new Date(Date.now()+2592e6)})).id,t=JSON.stringify(e),n=Object(b.c)(v,`benchmarks/${a}`);return await Object(b.d)(n,t,"raw"),a}catch(d){throw console.error("Error uploading benchmark data:",d),d}}(a));s(t)}catch(e){console.error("Error generating link:",e),i(`Failed to generate link: ${e.message}`)}finally{l(!1)}},disabled:m},m?"Generating...":"Generate Shareable Link"),c&&r.a.createElement("div",{className:"share-link-container"},r.a.createElement("input",{type:"text",value:c,readOnly:!0,className:"share-link-input",onClick:e=>e.target.select()}),r.a.createElement("button",{className:"copy-button",onClick:()=>{navigator.clipboard.writeText(c).then(()=>{u(!0),setTimeout(()=>u(!1),2e3)}).catch(e=>{console.error("Could not copy text: ",e)})}},o?"Copied!":"Copy")),d&&r.a.createElement("div",{className:"error-message"},d))))};var f=()=>{const[e,a]=Object(n.useState)("evolution"),[t,m]=Object(n.useState)("all"),[l,T]=Object(n.useState)({}),[y,f]=Object(n.useState)([]),[x,w]=Object(n.useState)([]),[k,S]=Object(n.useState)(!1),[P,D]=Object(n.useState)(""),[O,_]=Object(n.useState)(""),[j,A]=Object(n.useState)(!1),[K,R]=Object(n.useState)(!1),G=(e,a)=>(console.log(`Chart data for ${a}:`,e),e),I=(e,a)=>{try{const{benchmarks:n,stutters:r}=(e=>{const a=[],t=/\[(.+?)\] !!! STUTTER !!! ([\d.]+) FPS/g,n=/\[(.+?)\] (.+?)_(\d+) - Samples: (\d+), Duration: ([\d.]+)s\s+=== FPS STATISTICS ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+Frames < 60 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 45 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 30 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 15 FPS: (\d+) \(([\d.]+)%\)\s+=== GAME THREAD \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+=== RENDER THREAD \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+=== GPU TIME \(ms\) ===\s+Mean: ([\d.]+), Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)/g,r=/\[.+?\] (.+?)_(\d+) - Samples: (\d+), Duration: ([\d.]+)s\s+MEAN: ([\d.]+)\s+Median: ([\d.]+), Min: ([\d.]+), Max: ([\d.]+)\s+Frames < 60 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 45 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 30 FPS: (\d+) \(([\d.]+)%\)\s+Frames < 15 FPS: (\d+) \(([\d.]+)%\)/g;let m;for(;null!==(m=n.exec(e));)a.push({scene:m[2],run:parseInt(m[3]),samples:parseInt(m[4]),duration:parseFloat(m[5]),mean:parseFloat(m[6]),median:parseFloat(m[7]),min:parseFloat(m[8]),max:parseFloat(m[9]),frames_below_60:parseInt(m[10]),percent_below_60:parseFloat(m[11]),frames_below_45:parseInt(m[12]),percent_below_45:parseFloat(m[13]),frames_below_30:parseInt(m[14]),percent_below_30:parseFloat(m[15]),frames_below_15:parseInt(m[16]),percent_below_15:parseFloat(m[17]),gameThreadMean:parseFloat(m[18]),gameThreadMedian:parseFloat(m[19]),gameThreadMin:parseFloat(m[20]),gameThreadMax:parseFloat(m[21]),renderThreadMean:parseFloat(m[22]),renderThreadMedian:parseFloat(m[23]),renderThreadMin:parseFloat(m[24]),renderThreadMax:parseFloat(m[25]),gpuTimeMean:parseFloat(m[26]),gpuTimeMedian:parseFloat(m[27]),gpuTimeMin:parseFloat(m[28]),gpuTimeMax:parseFloat(m[29])});if(0===a.length){let t;for(;null!==(t=r.exec(e));)a.push({scene:t[1],run:parseInt(t[2]),samples:parseInt(t[3]),duration:parseFloat(t[4]),mean:parseFloat(t[5]),median:parseFloat(t[6]),min:parseFloat(t[7]),max:parseFloat(t[8]),frames_below_60:parseInt(t[9]),percent_below_60:parseFloat(t[10]),frames_below_45:parseInt(t[11]),percent_below_45:parseFloat(t[12]),frames_below_30:parseInt(t[13]),percent_below_30:parseFloat(t[14]),frames_below_15:parseInt(t[15]),percent_below_15:parseFloat(t[16])})}const l=[];let c;for(;null!==(c=t.exec(e));)l.push({timestamp:c[1],fps:parseFloat(c[2])});return{benchmarks:a,stutters:l}})(e);if(0===n.length)return D("No benchmark data found in the file. Make sure it has the correct format."),void S(!1);const{evolution:l,averages:c}=(e=>{const a={};e.forEach(e=>{a[e.scene]||(a[e.scene]=[]),a[e.scene].push({run:e.run,mean:e.mean,median:e.median,min:e.min,max:e.max,below60:e.percent_below_60,below45:e.percent_below_45,below30:e.percent_below_30,below15:e.percent_below_15,samples:e.samples,gameThreadMean:e.gameThreadMean,gameThreadMedian:e.gameThreadMedian,gameThreadMin:e.gameThreadMin,gameThreadMax:e.gameThreadMax,renderThreadMean:e.renderThreadMean,renderThreadMedian:e.renderThreadMedian,renderThreadMin:e.renderThreadMin,renderThreadMax:e.renderThreadMax,gpuTimeMean:e.gpuTimeMean,gpuTimeMedian:e.gpuTimeMedian,gpuTimeMin:e.gpuTimeMin,gpuTimeMax:e.gpuTimeMax})}),Object.keys(a).forEach(e=>{a[e].sort((e,a)=>e.run-a.run)});const t=Object.keys(a).map(e=>{const t=a[e],n=t.reduce((e,a)=>e+(a.samples||1),0),r=t.reduce((e,a)=>e+a.mean*(a.samples||1),0)/n,m=t.reduce((e,a)=>e+a.median*(a.samples||1),0)/n,l=Math.min(...t.map(e=>e.mean)),c=Math.max(...t.map(e=>e.mean)),s=t.some(e=>void 0!==e.gameThreadMean);let d=0,i=0,o=0,u=0,h=0,E=0,p=0,M=0,T=0;return s&&(d=t.reduce((e,a)=>e+(a.gameThreadMean||0)*(a.samples||1),0)/n,i=Math.min(...t.map(e=>e.gameThreadMean||Number.MAX_VALUE)),o=Math.max(...t.map(e=>e.gameThreadMean||0)),u=t.reduce((e,a)=>e+(a.renderThreadMean||0)*(a.samples||1),0)/n,h=Math.min(...t.map(e=>e.renderThreadMean||Number.MAX_VALUE)),E=Math.max(...t.map(e=>e.renderThreadMean||0)),p=t.reduce((e,a)=>e+(a.gpuTimeMean||0)*(a.samples||1),0)/n,M=Math.min(...t.map(e=>e.gpuTimeMean||Number.MAX_VALUE)),T=Math.max(...t.map(e=>e.gpuTimeMean||0))),{name:e,meanFPS:r,medianFPS:m,minFPS:Math.min(...t.map(e=>e.min)),maxFPS:Math.max(...t.map(e=>e.max)),minMeanFPS:l,maxMeanFPS:c,gameThreadMean:d,minGameThreadMean:i===Number.MAX_VALUE?0:i,maxGameThreadMean:o,renderThreadMean:u,minRenderThreadMean:h===Number.MAX_VALUE?0:h,maxRenderThreadMean:E,gpuTimeMean:p,minGpuTimeMean:M===Number.MAX_VALUE?0:M,maxGpuTimeMean:T,below60:t.reduce((e,a)=>e+a.below60*(a.samples||1),0)/n,below45:t.reduce((e,a)=>e+a.below45*(a.samples||1),0)/n,below30:t.reduce((e,a)=>e+a.below30*(a.samples||1),0)/n,below15:t.reduce((e,a)=>e+a.below15*(a.samples||1),0)/n,totalSamples:n,hasThreadData:s}});return{evolution:a,averages:t}})(n);T(l),f(c),w(r),_(a),Object.keys(l).length>0&&m("all"),S(!1),R(!1)}catch(t){console.error("Error processing content:",t),D("Error processing the data. Make sure it has the correct format."),S(!1),R(!1)}};const $=async e=>{R(!0),D("");try{const t=await async function(e){try{const a=Object(g.c)(F,"benchmarks",e);if(!(await Object(g.d)(a)).exists())throw new Error("Benchmark data not found or has expired");const t=Object(b.c)(v,`benchmarks/${e}`),n=await Object(b.a)(t),r=await fetch(n),m=await r.text();return JSON.parse(m)}catch(P){throw console.error("Error retrieving benchmark data:",P),P}}(e);if(t.rawLogContent)I(t.rawLogContent,t.fileName||"Shared Benchmark");else{if(!t.evolutionData||!t.sceneAverages)throw new Error("Invalid benchmark data format");T(t.evolutionData),f(t.sceneAverages),w(t.stutters||[]),_(t.fileName||"Shared Benchmark"),m("all"),S(!1),R(!1)}}catch(a){console.error("Error loading shared benchmark:",a),D(`Failed to load shared benchmark: ${a.message}`),R(!1)}},C=()=>{A(!j)},U=e=>e>=60?r.a.createElement("span",{className:"good-fps"},e.toFixed(2)):e>=45?r.a.createElement("span",{className:"average-fps"},e.toFixed(2)):e>=30?r.a.createElement("span",{className:"poor-fps"},e.toFixed(2)):r.a.createElement("span",{className:"bad-fps"},e.toFixed(2));Object(n.useEffect)(()=>{const e=new URLSearchParams(window.location.search),a=e.get("benchmark"),t=e.get("dropboxUrl");if(window.electronAPI&&window.electronAPI.onFileOpen((e,a)=>{const t=window.electronAPI.readFile(a),n=a.split(/[\\/]/).pop();I(t,n)}),t){S(!0),D("");const e=`/.netlify/functions/dropbox-proxy?url=${encodeURIComponent(t)}`;fetch(e).then(e=>{if(!e.ok)throw new Error(`Failed to download file: ${e.status} ${e.statusText}`);return e.text()}).then(e=>{const a=new URL(t).pathname.split("/"),n=a[a.length-1];I(e,n||"Dropbox File")}).catch(e=>{console.error("Error loading file:",e),D(`Error loading file: ${e.message}`),S(!1)})}else if(a)$(a);else{const e=(()=>{const e={Blockade1:[{run:0,mean:65.13,median:64.53,min:14.13,max:100.62,below60:29.2,below45:3.8,below30:1.7,below15:.2,samples:895,gameThreadMean:11.9,gameThreadMedian:11.44,gameThreadMin:8.28,gameThreadMax:23.7,renderThreadMean:5.2,renderThreadMedian:4.82,renderThreadMin:3.68,renderThreadMax:40.06,gpuTimeMean:14.12,gpuTimeMedian:13.85,gpuTimeMin:10.05,gpuTimeMax:32.24},{run:1,mean:51.48,median:51.91,min:12.03,max:62.07,below60:99,below45:6.3,below30:.4,below15:.4,samples:735,gameThreadMean:12.8,gameThreadMedian:12.1,gameThreadMin:8.5,gameThreadMax:25.3,renderThreadMean:5.6,renderThreadMedian:5.12,renderThreadMin:3.95,renderThreadMax:42.15,gpuTimeMean:15.2,gpuTimeMedian:14.75,gpuTimeMin:10.85,gpuTimeMax:34.5}],Slump:[{run:0,mean:77.79,median:80.49,min:17.24,max:114.48,below60:9.3,below45:2.1,below30:.8,below15:0,samples:1077,gameThreadMean:8.66,gameThreadMedian:8.62,gameThreadMin:6.86,gameThreadMax:15.63,renderThreadMean:4.37,renderThreadMedian:4.12,renderThreadMin:3.67,renderThreadMax:15.84,gpuTimeMean:11.8,gpuTimeMedian:11.06,gpuTimeMin:8.87,gpuTimeMax:38.35},{run:1,mean:54.27,median:54.27,min:13.62,max:62.18,below60:98,below45:.6,below30:.1,below15:.1,samples:783,gameThreadMean:9.2,gameThreadMedian:9.05,gameThreadMin:7.12,gameThreadMax:17.25,renderThreadMean:4.75,renderThreadMedian:4.45,renderThreadMin:3.8,renderThreadMax:16.75,gpuTimeMean:12.5,gpuTimeMedian:11.85,gpuTimeMin:9.1,gpuTimeMax:40.2}]},a=Object.keys(e).map(a=>{const t=e[a],n=t.reduce((e,a)=>e+a.samples,0),r=t.reduce((e,a)=>e+a.mean*a.samples,0)/n,m=t.reduce((e,a)=>e+a.median*a.samples,0)/n,l=Math.min(...t.map(e=>e.mean)),c=Math.max(...t.map(e=>e.mean)),s=t.reduce((e,a)=>e+a.gameThreadMean*a.samples,0)/n,d=Math.min(...t.map(e=>e.gameThreadMean)),i=Math.max(...t.map(e=>e.gameThreadMean)),o=t.reduce((e,a)=>e+a.renderThreadMean*a.samples,0)/n,u=Math.min(...t.map(e=>e.renderThreadMean)),h=Math.max(...t.map(e=>e.renderThreadMean)),E=t.reduce((e,a)=>e+a.gpuTimeMean*a.samples,0)/n,p=Math.min(...t.map(e=>e.gpuTimeMean)),M=Math.max(...t.map(e=>e.gpuTimeMean));return{name:a,meanFPS:r,medianFPS:m,minFPS:Math.min(...t.map(e=>e.min)),maxFPS:Math.max(...t.map(e=>e.max)),minMeanFPS:l,maxMeanFPS:c,gameThreadMean:s,minGameThreadMean:d,maxGameThreadMean:i,renderThreadMean:o,minRenderThreadMean:u,maxRenderThreadMean:h,gpuTimeMean:E,minGpuTimeMean:p,maxGpuTimeMean:M,below60:t.reduce((e,a)=>e+a.below60*a.samples,0)/n,below45:t.reduce((e,a)=>e+a.below45*a.samples,0)/n,below30:t.reduce((e,a)=>e+a.below30*a.samples,0)/n,below15:t.reduce((e,a)=>e+a.below15*a.samples,0)/n,totalSamples:n,hasThreadData:!0}});return{evolution:e,averages:a,stutters:[{timestamp:"2025-03-10 18:32:15",fps:9.91},{timestamp:"2025-03-10 18:32:31",fps:9.61},{timestamp:"2025-03-10 18:33:51",fps:9.65}]}})();T(e.evolution),f(e.averages),w(e.stutters),_("Sample Data (Demo)")}},[]),Object(n.useEffect)(()=>{if(Object.keys(l).length>0){const e=setTimeout(()=>{T({...l})},100);return()=>clearTimeout(e)}},[l]);const L=(()=>{if(!l||0===Object.keys(l).length)return[];if("all"===t){const e=Object.keys(l).map(e=>l[e].map(a=>({run:`Run ${a.run}`,[e]:a.mean}))).flat().reduce((e,a)=>e.find(e=>e.run===a.run)?e.map(e=>e.run===a.run?{...e,...a}:e):[...e,a],[]).sort((e,a)=>parseInt(e.run.split(" ")[1])-parseInt(a.run.split(" ")[1]));return console.log("All Scenes Data:",e),e}{const e=l[t]?l[t].map(e=>({run:`Run ${e.run}`,mean:e.mean,median:e.median,min:e.min,max:e.max})):[];return console.log("Scene Data for",t,":",e),e}})();return k||K?r.a.createElement("div",{className:"benchmark-container"},r.a.createElement("div",{className:"loading"},"Loading benchmark data...")):r.a.createElement("div",{className:"benchmark-container"},r.a.createElement("h1",{className:"title"},"Benchmark Performance Analyzer"),r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Load Benchmark Data"),r.a.createElement("div",{className:"controls-row"},r.a.createElement("div",null,r.a.createElement("label",{className:"upload-button"},"Upload Log File",r.a.createElement("input",{type:"file",accept:".log,.txt",className:"hidden",onChange:e=>{const a=e.target.files[0];if(!a)return;S(!0),D(""),_(a.name);const t=new FileReader;t.onload=(e=>{try{const n=e.target.result;I(n,a.name)}catch(t){console.error("Error processing file:",t),D("Error processing the file. Make sure it has the correct format."),S(!1)}}),t.onerror=(()=>{D("Error reading the file. Please try again."),S(!1)}),t.readAsText(a)}})),r.a.createElement("span",{className:"filename"},O?`Current file: ${O}`:"No file selected")),Object.keys(l).length>0&&r.a.createElement("button",{className:"share-button",onClick:C},"Share Results")),P&&r.a.createElement("div",{className:"error-message"},P)),r.a.createElement("div",{className:"tabs"},r.a.createElement("button",{className:`tab-button ${"evolution"===e?"active":""}`,onClick:()=>a("evolution")},"Performance Evolution"),r.a.createElement("button",{className:`tab-button ${"overview"===e?"active":""}`,onClick:()=>a("overview")},"Overview")),0===Object.keys(l).length&&!k&&r.a.createElement("div",{className:"section empty-state"},r.a.createElement("h2",{className:"subtitle"},"No Data Available"),r.a.createElement("p",null,"Please upload a benchmark log file to visualize performance data.")),"evolution"===e&&Object.keys(l).length>0&&r.a.createElement("div",null,r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Performance Evolution Over Runs"),r.a.createElement("div",{className:"selector-container"},r.a.createElement("label",{htmlFor:"scene-select",className:"selector-label"},"Select Scene:"),r.a.createElement("select",{id:"scene-select",className:"scene-selector",value:t,onChange:e=>m(e.target.value)},r.a.createElement("option",{value:"all"},"All Scenes"),Object.keys(l).map(e=>r.a.createElement("option",{key:e,value:e},e)))),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},"all"===t?r.a.createElement(s.a,{data:L},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"run"}),r.a.createElement(o.a,{domain:[0,"dataMax + 10"]}),r.a.createElement(u.a,null),r.a.createElement(h.a,null),Object.keys(l).map((e,a)=>r.a.createElement(E.a,{key:e,type:"monotone",dataKey:e,name:e,stroke:0===a?"#8884d8":1===a?"#82ca9d":2===a?"#ffc658":3===a?"#ff7300":"#0088FE"}))):r.a.createElement(s.a,{data:L},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"run"}),r.a.createElement(o.a,{domain:[0,"dataMax + 10"]}),r.a.createElement(u.a,null),r.a.createElement(h.a,null),r.a.createElement(E.a,{type:"monotone",dataKey:"mean",name:"Mean FPS",stroke:"#8884d8"}),r.a.createElement(E.a,{type:"monotone",dataKey:"median",name:"Median FPS",stroke:"#82ca9d"}),r.a.createElement(E.a,{type:"monotone",dataKey:"min",name:"Min FPS",stroke:"#ff7300",strokeDasharray:"5 5"}),r.a.createElement(E.a,{type:"monotone",dataKey:"max",name:"Max FPS",stroke:"#0088FE",strokeDasharray:"3 3"}))))),"all"===t&&y.some(e=>e.hasThreadData)&&r.a.createElement("div",{className:"section mt-4"},r.a.createElement("h2",{className:"subtitle"},"Thread Time Comparison Across Scenes (ms)"),r.a.createElement("div",{className:"chart-container",style:{height:"450px",marginBottom:"40px"}},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(p.a,{data:y&&0!==y.length&&y[0].hasThreadData?y.map(e=>({name:e.name,gameThread:e.gameThreadMean||0,renderThread:e.renderThreadMean||0,gpuTime:e.gpuTimeMean||0})):[],margin:{top:20,right:30,left:20,bottom:20}},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"name"}),r.a.createElement(o.a,null),r.a.createElement(u.a,{formatter:e=>e.toFixed(2)}),r.a.createElement(h.a,{wrapperStyle:{position:"relative",marginTop:"10px"}}),r.a.createElement(M.a,{dataKey:"gameThread",name:"Game Thread",fill:"#8884d8"}),r.a.createElement(M.a,{dataKey:"renderThread",name:"Render Thread",fill:"#82ca9d"}),r.a.createElement(M.a,{dataKey:"gpuTime",name:"GPU Time",fill:"#ff7300"}))))),"all"!==t&&l[t]&&r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Performance Metrics for ",t),r.a.createElement("div",{className:"metrics-grid"},r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"Game Thread Time (ms)"),r.a.createElement("div",{className:".chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(s.a,{data:G(l[t].map(e=>({run:`Run ${e.run}`,mean:e.gameThreadMean||0,median:e.gameThreadMedian||0,min:e.gameThreadMin||0,max:e.gameThreadMax||0})),"Game Thread")},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"run"}),r.a.createElement(o.a,{domain:[0,"dataMax + 5"]}),r.a.createElement(u.a,{formatter:e=>e.toFixed(2),labelFormatter:e=>`${e}`}),r.a.createElement(h.a,null),r.a.createElement(E.a,{type:"monotone",dataKey:"mean",name:"Mean Time",stroke:"#8884d8",activeDot:{r:8}}),r.a.createElement(E.a,{type:"monotone",dataKey:"median",name:"Median Time",stroke:"#82ca9d"}),r.a.createElement(E.a,{type:"monotone",dataKey:"min",name:"Min Time",stroke:"#ff7300",strokeDasharray:"5 5"}),r.a.createElement(E.a,{type:"monotone",dataKey:"max",name:"Max Time",stroke:"#0088FE",strokeDasharray:"3 3"}))))),r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"Render Thread Time (ms)"),r.a.createElement("div",{className:".chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(s.a,{data:G(l[t].map(e=>({run:`Run ${e.run}`,mean:e.renderThreadMean||0,median:e.renderThreadMedian||0,min:e.renderThreadMin||0,max:e.renderThreadMax||0})),"Render Thread")},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"run"}),r.a.createElement(o.a,{domain:[0,"dataMax + 5"]}),r.a.createElement(u.a,{formatter:e=>e.toFixed(2),labelFormatter:e=>`${e}`}),r.a.createElement(h.a,null),r.a.createElement(E.a,{type:"monotone",dataKey:"mean",name:"Mean Time",stroke:"#8884d8",activeDot:{r:8}}),r.a.createElement(E.a,{type:"monotone",dataKey:"median",name:"Median Time",stroke:"#82ca9d"}),r.a.createElement(E.a,{type:"monotone",dataKey:"min",name:"Min Time",stroke:"#ff7300",strokeDasharray:"5 5"}),r.a.createElement(E.a,{type:"monotone",dataKey:"max",name:"Max Time",stroke:"#0088FE",strokeDasharray:"3 3"}))))),r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"GPU Time (ms)"),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(s.a,{data:G(l[t].map(e=>({run:`Run ${e.run}`,mean:e.gpuTimeMean||0,median:e.gpuTimeMedian||0,min:e.gpuTimeMin||0,max:e.gpuTimeMax||0})),"GPU Time")},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"run"}),r.a.createElement(o.a,{domain:[0,"dataMax + 5"]}),r.a.createElement(u.a,{formatter:e=>e.toFixed(2),labelFormatter:e=>`${e}`}),r.a.createElement(h.a,null),r.a.createElement(E.a,{type:"monotone",dataKey:"mean",name:"Mean Time",stroke:"#8884d8",activeDot:{r:8}}),r.a.createElement(E.a,{type:"monotone",dataKey:"median",name:"Median Time",stroke:"#82ca9d"}),r.a.createElement(E.a,{type:"monotone",dataKey:"min",name:"Min Time",stroke:"#ff7300",strokeDasharray:"5 5"}),r.a.createElement(E.a,{type:"monotone",dataKey:"max",name:"Max Time",stroke:"#0088FE",strokeDasharray:"3 3"}))))))),j&&r.a.createElement(N,{benchmarkData:{evolutionData:l,sceneAverages:y,stutters:x,fileName:O,sharedAt:(new Date).toISOString()},onClose:C}),r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Performance Metrics Across Runs"),Object.keys(l).map(e=>r.a.createElement("div",{key:e,className:"scene-metrics"},r.a.createElement("h3",{className:"scene-title"},e),r.a.createElement("div",{className:"table-container"},r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Metric"),l[e].map(e=>r.a.createElement("th",{key:e.run},"Run ",e.run)))),r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Mean FPS"),l[e].map(e=>r.a.createElement("td",{key:e.run,className:"metric-value"},U(e.mean)))),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Median FPS"),l[e].map(e=>r.a.createElement("td",{key:e.run,className:"metric-value"},U(e.median)))),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Min FPS"),l[e].map(e=>r.a.createElement("td",{key:e.run,className:"metric-value bad-fps"},e.min.toFixed(2)))),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Max FPS"),l[e].map(e=>r.a.createElement("td",{key:e.run,className:"metric-value good-fps"},e.max.toFixed(2)))),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Frames < 60 FPS (%)"),l[e].map(e=>r.a.createElement("td",{key:e.run,className:"metric-value"},e.below60.toFixed(1),"%"))),void 0!==l[e][0].gameThreadMean&&r.a.createElement(r.a.Fragment,null,r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Game Thread (ms)"),l[e].map(e=>{var a;return r.a.createElement("td",{key:e.run,className:"metric-value"},(null===(a=e.gameThreadMean)||void 0===a?void 0:a.toFixed(2))||"N/A")})),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"Render Thread (ms)"),l[e].map(e=>{var a;return r.a.createElement("td",{key:e.run,className:"metric-value"},(null===(a=e.renderThreadMean)||void 0===a?void 0:a.toFixed(2))||"N/A")})),r.a.createElement("tr",null,r.a.createElement("td",{className:"metric-name"},"GPU Time (ms)"),l[e].map(e=>{var a;return r.a.createElement("td",{key:e.run,className:"metric-value"},(null===(a=e.gpuTimeMean)||void 0===a?void 0:a.toFixed(2))||"N/A")})))))))))),"overview"===e&&Object.keys(l).length>0&&r.a.createElement("div",null,r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Benchmark Summary"),r.a.createElement("div",{className:"summary-grid"},r.a.createElement("div",{className:"summary-card"},r.a.createElement("div",{className:"summary-label"},"Overall Average FPS"),r.a.createElement("div",{className:"summary-value"},(y.reduce((e,a)=>e+a.meanFPS*a.totalSamples,0)/y.reduce((e,a)=>e+a.totalSamples,0)).toFixed(2)),r.a.createElement("div",{className:"summary-note"},"Weighted average across all samples")),r.a.createElement("div",{className:"summary-card"},r.a.createElement("div",{className:"summary-label"},"FPS Range"),r.a.createElement("div",{className:"summary-value"},r.a.createElement("span",{className:"bad-fps"},Math.min(...y.map(e=>e.minFPS)).toFixed(2))," -",r.a.createElement("span",{className:"good-fps"},Math.max(...y.map(e=>e.maxFPS)).toFixed(2))),r.a.createElement("div",{className:"summary-note"},"Min/max across all scenes and runs")),r.a.createElement("div",{className:"summary-card"},r.a.createElement("div",{className:"summary-label"},"Stutter Events"),r.a.createElement("div",{className:"summary-value bad-fps"},x.length),r.a.createElement("div",{className:"summary-note"},"FPS drops below 15 FPS")))),r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Performance Metrics by Scene"),r.a.createElement("div",{className:"metrics-grid"},r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"Mean FPS Range"),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(p.a,{data:y},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"name"}),r.a.createElement(o.a,null),r.a.createElement(u.a,null),r.a.createElement(h.a,null),r.a.createElement(M.a,{dataKey:"minMeanFPS",name:"Min Mean FPS",fill:"#ff7300"}),r.a.createElement(M.a,{dataKey:"maxMeanFPS",name:"Max Mean FPS",fill:"#0088FE"}))))),y.some(e=>e.hasThreadData)&&r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"Game Thread Time (ms)"),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(p.a,{data:y},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"name"}),r.a.createElement(o.a,null),r.a.createElement(u.a,null),r.a.createElement(h.a,null),r.a.createElement(M.a,{dataKey:"minGameThreadMean",name:"Min Game Thread",fill:"#82ca9d"}),r.a.createElement(M.a,{dataKey:"maxGameThreadMean",name:"Max Game Thread",fill:"#8884d8"}))))),r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"Render Thread Time (ms)"),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(p.a,{data:y},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"name"}),r.a.createElement(o.a,null),r.a.createElement(u.a,null),r.a.createElement(h.a,null),r.a.createElement(M.a,{dataKey:"minRenderThreadMean",name:"Min Render Thread",fill:"#82ca9d"}),r.a.createElement(M.a,{dataKey:"maxRenderThreadMean",name:"Max Render Thread",fill:"#8884d8"}))))),r.a.createElement("div",{className:"metric-card"},r.a.createElement("h3",{className:"metric-title"},"GPU Time (ms)"),r.a.createElement("div",{className:"chart-container"},r.a.createElement(c.a,{width:"100%",height:"100%"},r.a.createElement(p.a,{data:y},r.a.createElement(d.a,{strokeDasharray:"3 3"}),r.a.createElement(i.a,{dataKey:"name"}),r.a.createElement(o.a,null),r.a.createElement(u.a,null),r.a.createElement(h.a,null),r.a.createElement(M.a,{dataKey:"minGpuTimeMean",name:"Min GPU Time",fill:"#82ca9d"}),r.a.createElement(M.a,{dataKey:"maxGpuTimeMean",name:"Max GPU Time",fill:"#8884d8"})))))))),r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Scene Performance Summary"),r.a.createElement("div",{className:"table-container"},r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Scene"),r.a.createElement("th",null,"Mean FPS"),r.a.createElement("th",null,"Median FPS"),r.a.createElement("th",null,"Min FPS"),r.a.createElement("th",null,"Max FPS"),r.a.createElement("th",null,"Frames < 60 FPS"),y.some(e=>e.hasThreadData)&&r.a.createElement(r.a.Fragment,null,r.a.createElement("th",null,"Game Thread (ms)"),r.a.createElement("th",null,"Render Thread (ms)"),r.a.createElement("th",null,"GPU Time (ms)")))),r.a.createElement("tbody",null,y.map((e,a)=>{var t,n,m;return r.a.createElement("tr",{key:a},r.a.createElement("td",null,e.name),r.a.createElement("td",null,U(e.meanFPS)),r.a.createElement("td",null,U(e.medianFPS)),r.a.createElement("td",{className:"bad-fps"},e.minFPS.toFixed(2)),r.a.createElement("td",{className:"good-fps"},e.maxFPS.toFixed(2)),r.a.createElement("td",null,e.below60.toFixed(1),"%"),e.hasThreadData&&r.a.createElement(r.a.Fragment,null,r.a.createElement("td",null,(null===(t=e.gameThreadMean)||void 0===t?void 0:t.toFixed(2))||"N/A"),r.a.createElement("td",null,(null===(n=e.renderThreadMean)||void 0===n?void 0:n.toFixed(2))||"N/A"),r.a.createElement("td",null,(null===(m=e.gpuTimeMean)||void 0===m?void 0:m.toFixed(2))||"N/A")))}))))),x.length>0&&r.a.createElement("div",{className:"section"},r.a.createElement("h2",{className:"subtitle"},"Stutter Events"),r.a.createElement("div",{className:"table-container"},r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Timestamp"),r.a.createElement("th",null,"FPS"))),r.a.createElement("tbody",null,x.map((e,a)=>r.a.createElement("tr",{key:a,className:"stutter-row"},r.a.createElement("td",{style:{whiteSpace:"normal",wordBreak:"break-word"}},e.timestamp.replace(/(\d{2}):(\d{2}):(\d{2})/,"$1:$2:$3 ")),r.a.createElement("td",{className:"bad-fps"},e.fps.toFixed(2))))))))))};var x=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(f,null))};var w=e=>{e&&e instanceof Function&&t.e(3).then(t.bind(null,496)).then(a=>{let{getCLS:t,getFID:n,getFCP:r,getLCP:m,getTTFB:l}=a;t(e),n(e),r(e),m(e),l(e)})};l.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(x,null))),w()}},[[258,1,2]]]);
//# sourceMappingURL=main.3586e96d.chunk.js.map