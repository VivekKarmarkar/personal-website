import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ElectrostaticEquilibrium = () => {
  const canvasRef = useRef(null);
  const [testChargePos, setTestChargePos] = useState({ x: 300, y: 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [showGaussianSurface, setShowGaussianSurface] = useState(true);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showFieldVectors, setShowFieldVectors] = useState(true);
  const [gaussianRadius, setGaussianRadius] = useState(40);
  const [animating, setAnimating] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);
  
  // Data collection state
  const [collectingData, setCollectingData] = useState(false);
  const [collectedData, setCollectedData] = useState([]);
  const collectingDataRef = useRef(false);
  const collectedDataRef = useRef([]);
  const timeRef = useRef(0);
  
  // Use refs for animation state to avoid stale closures
  const animatingRef = useRef(false);
  const posRef = useRef({ x: 300, y: 250 });
  const trailRef = useRef([]);
  const animationRef = useRef(null);

  // Triangle vertices (negative charges)
  const triangleCenter = { x: 300, y: 250 };
  const triangleRadius = 120;
  const negativeCharges = [0, 1, 2].map(i => ({
    x: triangleCenter.x + triangleRadius * Math.cos(i * 2 * Math.PI / 3 - Math.PI / 2),
    y: triangleCenter.y + triangleRadius * Math.sin(i * 2 * Math.PI / 3 - Math.PI / 2),
    q: -1
  }));

  // Calculate electric field at a point due to all charges
  // For negative charges, E points TOWARD the charge
  const calculateField = (px, py) => {
    let Ex = 0, Ey = 0;
    const k = 5000; // Scaling constant

    negativeCharges.forEach((charge) => {
      const dx = px - charge.x; // vector from charge to field point
      const dy = py - charge.y;
      const r2 = dx * dx + dy * dy;
      const r = Math.sqrt(r2);
      if (r > 5) {
        // CORRECT PHYSICS: 1/r² law, all negative charges
        const Emag = k * Math.abs(charge.q) / r2;
        const sign = -1; // E points toward negative charge

        Ex += sign * Emag * dx / r;
        Ey += sign * Emag * dy / r;
      }
    });

    return { Ex, Ey, magnitude: Math.sqrt(Ex * Ex + Ey * Ey) };
  };

  // Get all field arrow positions and their E values
  const getFieldArrowData = () => {
    const arrows = [];
    
    // Arrows along field lines
    negativeCharges.forEach((charge, chargeIdx) => {
      for (let i = 0; i < 16; i++) {
        const startAngle = (i / 16) * 2 * Math.PI;
        let px = charge.x + 22 * Math.cos(startAngle);
        let py = charge.y + 22 * Math.sin(startAngle);
        
        const linePoints = [];
        for (let step = 0; step < 150; step++) {
          const { Ex, Ey, magnitude } = calculateField(px, py);
          if (magnitude < 0.05) break;
          linePoints.push({ x: px, y: py, Ex, Ey, magnitude });
          const stepSize = 6;
          px -= (Ex / magnitude) * stepSize;
          py -= (Ey / magnitude) * stepSize;
          if (px < -20 || px > 620 || py < -20 || py > 520) break;
        }
        
        const arrowInterval = 10;
        for (let j = 5; j < linePoints.length - 2; j += arrowInterval) {
          const p = linePoints[j];
          arrows.push({
            x: p.x,
            y: p.y,
            Ex: p.Ex,
            Ey: p.Ey,
            source: `fieldline_charge${chargeIdx}_line${i}_point${j}`
          });
        }
      }
    });
    
    // Gap arrows
    const gapPoints = [
      { x: 300, y: 150 }, { x: 300, y: 350 },
      { x: 200, y: 200 }, { x: 400, y: 200 },
      { x: 200, y: 320 }, { x: 400, y: 320 },
      { x: 150, y: 250 }, { x: 450, y: 250 },
      { x: 300, y: 250 }, { x: 250, y: 180 },
      { x: 350, y: 180 }, { x: 250, y: 320 },
      { x: 350, y: 320 },
    ];
    
    gapPoints.forEach((point, idx) => {
      let tooClose = false;
      negativeCharges.forEach(c => {
        if (Math.sqrt((point.x - c.x) ** 2 + (point.y - c.y) ** 2) < 40) tooClose = true;
      });
      if (tooClose) return;
      
      const { Ex, Ey, magnitude } = calculateField(point.x, point.y);
      if (magnitude < 0.1) return;
      
      arrows.push({
        x: point.x,
        y: point.y,
        Ex,
        Ey,
        source: `gap_${idx}`
      });
    });
    
    return arrows;
  };

  // Collect data snapshot
  const collectDataSnapshot = (t, pos) => {
    const fieldArrows = getFieldArrowData();
    
    const snapshot = {
      t,
      negativeCharges: negativeCharges.map((c, i) => ({
        id: i + 1,
        x: c.x,
        y: c.y
      })),
      testCharge: {
        x: pos.x,
        y: pos.y
      },
      fieldArrows: fieldArrows.map(a => ({
        x: a.x,
        y: a.y,
        Ex: a.Ex,
        Ey: a.Ey
      }))
    };
    
    return snapshot;
  };

  // Animation loop using refs to avoid stale closure issues
  const animate = () => {
    if (!animatingRef.current) return;
    
    const pos = posRef.current;
    const { Ex, Ey, magnitude } = calculateField(pos.x, pos.y);
    
    if (magnitude > 0.1) {
      // Positive charge moves IN DIRECTION of field (attracted to negative charges)
      const speed = 3;
      const newX = pos.x + (Ex / magnitude) * speed;
      const newY = pos.y + (Ey / magnitude) * speed;
      
      // Check collision with negative charges
      let collision = false;
      negativeCharges.forEach(charge => {
        const dist = Math.sqrt((newX - charge.x) ** 2 + (newY - charge.y) ** 2);
        if (dist < 20) collision = true;
      });
      
      if (!collision && newX > 30 && newX < 570 && newY > 30 && newY < 470) {
        // Update trail
        trailRef.current = [...trailRef.current.slice(-80), { x: pos.x, y: pos.y }];
        setTrailPoints([...trailRef.current]);
        
        // Update position
        posRef.current = { x: newX, y: newY };
        setTestChargePos({ x: newX, y: newY });
        
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Hit boundary or charge
        animatingRef.current = false;
        setAnimating(false);
      }
    } else {
      // Field too weak (at equilibrium point) - add tiny perturbation
      posRef.current = { x: pos.x + (Math.random() - 0.5) * 2, y: pos.y + (Math.random() - 0.5) * 2 };
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Start/stop animation
  const toggleAnimation = () => {
    if (animating) {
      animatingRef.current = false;
      setAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      // Start animation
      trailRef.current = [];
      setTrailPoints([]);
      posRef.current = { ...testChargePos };
      animatingRef.current = true;
      setAnimating(true);
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Data collection loop - runs independently of animation
  const dataCollectionRef = useRef(null);
  const testChargePosRef = useRef(testChargePos);
  
  // Keep ref in sync with state
  useEffect(() => {
    testChargePosRef.current = testChargePos;
  }, [testChargePos]);
  
  const dataCollectionLoop = () => {
    if (!collectingDataRef.current) return;
    
    const snapshot = collectDataSnapshot(timeRef.current, testChargePosRef.current);
    collectedDataRef.current.push(snapshot);
    setCollectedData([...collectedDataRef.current]);
    timeRef.current += 1;
    
    // Continue collecting at ~30fps
    dataCollectionRef.current = setTimeout(dataCollectionLoop, 33);
  };

  // Toggle data collection
  const toggleDataCollection = () => {
    if (collectingData) {
      // Stop collecting
      collectingDataRef.current = false;
      setCollectingData(false);
      if (dataCollectionRef.current) {
        clearTimeout(dataCollectionRef.current);
      }
    } else {
      // Reset data and start collecting immediately
      collectedDataRef.current = [];
      setCollectedData([]);
      timeRef.current = 0;
      collectingDataRef.current = true;
      setCollectingData(true);
      dataCollectionLoop(); // Start the loop immediately
    }
  };

  // Download collected data as JSON
  const downloadData = () => {
    if (collectedData.length === 0) {
      alert('No data collected yet. Enable "Collect Data" and run the simulation.');
      return;
    }
    
    const dataStr = JSON.stringify(collectedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electrostatic_sim_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (dataCollectionRef.current) {
        clearTimeout(dataCollectionRef.current);
      }
    };
  }, []);

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw field lines with arrows showing direction and magnitude
    if (showFieldLines || showFieldVectors) {
      negativeCharges.forEach(charge => {
        for (let i = 0; i < 16; i++) {
          const startAngle = (i / 16) * 2 * Math.PI;
          
          // Store points along the field line
          const linePoints = [];
          let px = charge.x + 22 * Math.cos(startAngle);
          let py = charge.y + 22 * Math.sin(startAngle);
          
          // Trace field line outward (opposite to field direction since field points toward negative)
          for (let step = 0; step < 150; step++) {
            const { Ex, Ey, magnitude } = calculateField(px, py);
            if (magnitude < 0.05) break;
            
            linePoints.push({ x: px, y: py, Ex, Ey, magnitude });
            
            // Move opposite to field (away from negative charge)
            const stepSize = 6;
            px -= (Ex / magnitude) * stepSize;
            py -= (Ey / magnitude) * stepSize;
            
            if (px < -20 || px > width + 20 || py < -20 || py > height + 20) break;
          }
          
          // Draw the field line
          if (showFieldLines && linePoints.length > 1) {
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(linePoints[0].x, linePoints[0].y);
            linePoints.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
          }
          
          // Draw arrows along the field line
          if (showFieldVectors) {
            // Place arrows at regular intervals along the line
            const arrowInterval = 10; // Every 10th point
            for (let j = 5; j < linePoints.length - 2; j += arrowInterval) {
              const p = linePoints[j];
              const { Ex, Ey, magnitude } = p;
              
              // Arrow points TOWARD the negative charge (direction of E field)
              const angle = Math.atan2(Ey, Ex);
              
              // Use logarithmic scaling to handle the huge dynamic range of 1/r²
              // magnitude ranges roughly from 0.1 (far) to 10+ (near charges)
              const logMag = Math.log10(magnitude + 0.1); // ranges from about -1 to 1+
              const normalizedMag = Math.max(0, Math.min(1, (logMag + 1) / 2)); // map to 0-1
              
              // Arrows near charges (high magnitude) should be MUCH larger
              const arrowLen = 6 + normalizedMag * 30; // 6 to 36 pixels
              
              // Color intensity also scales with magnitude
              const intensity = 0.4 + normalizedMag * 0.6;
              
              // Draw arrow shaft
              ctx.strokeStyle = `rgba(255, 180, 100, ${intensity})`;
              ctx.lineWidth = 1.5 + normalizedMag * 1.5;
              ctx.beginPath();
              const startX = p.x - (arrowLen/2) * Math.cos(angle);
              const startY = p.y - (arrowLen/2) * Math.sin(angle);
              const endX = p.x + (arrowLen/2) * Math.cos(angle);
              const endY = p.y + (arrowLen/2) * Math.sin(angle);
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
              
              // Draw arrowhead - larger for stronger fields
              const headSize = 4 + normalizedMag * 6;
              ctx.fillStyle = `rgba(255, 180, 100, ${intensity})`;
              ctx.beginPath();
              ctx.moveTo(endX, endY);
              ctx.lineTo(
                endX - headSize * Math.cos(angle - 0.4),
                endY - headSize * Math.sin(angle - 0.4)
              );
              ctx.lineTo(
                endX - headSize * Math.cos(angle + 0.4),
                endY - headSize * Math.sin(angle + 0.4)
              );
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      });
      
      // Add some arrows in the gaps (areas between field lines)
      if (showFieldVectors) {
        const gapPoints = [
          { x: 300, y: 150 }, // Above center
          { x: 300, y: 350 }, // Below center
          { x: 200, y: 200 }, // Upper left
          { x: 400, y: 200 }, // Upper right
          { x: 200, y: 320 }, // Lower left
          { x: 400, y: 320 }, // Lower right
          { x: 150, y: 250 }, // Far left
          { x: 450, y: 250 }, // Far right
          { x: 300, y: 250 }, // Center
          { x: 250, y: 180 }, 
          { x: 350, y: 180 },
          { x: 250, y: 320 },
          { x: 350, y: 320 },
        ];
        
        gapPoints.forEach(point => {
          // Skip if too close to a charge
          let tooClose = false;
          negativeCharges.forEach(c => {
            if (Math.sqrt((point.x - c.x) ** 2 + (point.y - c.y) ** 2) < 40) tooClose = true;
          });
          if (tooClose) return;
          
          const { Ex, Ey, magnitude } = calculateField(point.x, point.y);
          if (magnitude < 0.1) return;
          
          const angle = Math.atan2(Ey, Ex);
          
          // Same log scaling as field line arrows
          const logMag = Math.log10(magnitude + 0.1);
          const normalizedMag = Math.max(0, Math.min(1, (logMag + 1) / 2));
          const arrowLen = 6 + normalizedMag * 30;
          const intensity = 0.4 + normalizedMag * 0.6;
          
          ctx.strokeStyle = `rgba(255, 180, 100, ${intensity})`;
          ctx.lineWidth = 1.5 + normalizedMag * 1.5;
          ctx.beginPath();
          const startX = point.x - (arrowLen/2) * Math.cos(angle);
          const startY = point.y - (arrowLen/2) * Math.sin(angle);
          const endX = point.x + (arrowLen/2) * Math.cos(angle);
          const endY = point.y + (arrowLen/2) * Math.sin(angle);
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          const headSize = 4 + normalizedMag * 6;
          ctx.fillStyle = `rgba(255, 180, 100, ${intensity})`;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headSize * Math.cos(angle - 0.4), endY - headSize * Math.sin(angle - 0.4));
          ctx.lineTo(endX - headSize * Math.cos(angle + 0.4), endY - headSize * Math.sin(angle + 0.4));
          ctx.closePath();
          ctx.fill();
        });
      }
    }
    
    // Draw trail
    if (trailPoints.length > 1) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
      trailPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
    
    // Draw negative charges (corners of triangle)
    negativeCharges.forEach(charge => {
      // Glow
      const gradient = ctx.createRadialGradient(charge.x, charge.y, 0, charge.x, charge.y, 30);
      gradient.addColorStop(0, 'rgba(65, 105, 225, 0.5)');
      gradient.addColorStop(1, 'rgba(65, 105, 225, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Charge
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Minus sign
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(charge.x - 7, charge.y);
      ctx.lineTo(charge.x + 7, charge.y);
      ctx.stroke();
    });
    
    // Draw Gaussian surface around test charge
    if (showGaussianSurface) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(testChargePos.x, testChargePos.y, gaussianRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw flux arrows on the Gaussian surface showing E·n component
      const numVectors = 24;
      for (let i = 0; i < numVectors; i++) {
        const angle = (i / numVectors) * 2 * Math.PI;
        const px = testChargePos.x + gaussianRadius * Math.cos(angle);
        const py = testChargePos.y + gaussianRadius * Math.sin(angle);
        
        const { Ex, Ey, magnitude } = calculateField(px, py);
        
        // Normal vector pointing outward from surface
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        
        // E·n is the flux density - positive = outward, negative = inward
        const EdotN = Ex * nx + Ey * ny;
        
        if (Math.abs(EdotN) > 0.1) {
          // Arrow length proportional to |E·n|
          const arrowLen = Math.min(25, Math.abs(EdotN) * 3);
          
          // Color: red for outward (positive flux), cyan for inward (negative flux)
          const isOutward = EdotN > 0;
          ctx.strokeStyle = isOutward ? '#ff6b6b' : '#4ecdc4';
          ctx.fillStyle = isOutward ? '#ff6b6b' : '#4ecdc4';
          ctx.lineWidth = 2;
          
          // Arrow points along normal direction (outward or inward based on flux sign)
          const arrowDir = isOutward ? 1 : -1;
          const startX = px;
          const startY = py;
          const endX = px + arrowDir * arrowLen * nx;
          const endY = py + arrowDir * arrowLen * ny;
          
          // Draw arrow shaft
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Draw arrowhead
          const headSize = 5;
          const headAngle = Math.atan2(endY - startY, endX - startX);
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - headSize * Math.cos(headAngle - 0.5),
            endY - headSize * Math.sin(headAngle - 0.5)
          );
          ctx.lineTo(
            endX - headSize * Math.cos(headAngle + 0.5),
            endY - headSize * Math.sin(headAngle + 0.5)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
      
      // Label
      ctx.fillStyle = 'yellow';
      ctx.font = '12px Arial';
      ctx.fillText('Gaussian', testChargePos.x + gaussianRadius + 5, testChargePos.y - 10);
      ctx.fillText('Surface', testChargePos.x + gaussianRadius + 5, testChargePos.y + 5);
    }
    
    // Draw test charge (positive)
    const testGradient = ctx.createRadialGradient(
      testChargePos.x, testChargePos.y, 0,
      testChargePos.x, testChargePos.y, 25
    );
    testGradient.addColorStop(0, 'rgba(255, 100, 100, 0.6)');
    testGradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
    ctx.fillStyle = testGradient;
    ctx.beginPath();
    ctx.arc(testChargePos.x, testChargePos.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(testChargePos.x, testChargePos.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Plus sign
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(testChargePos.x - 6, testChargePos.y);
    ctx.lineTo(testChargePos.x + 6, testChargePos.y);
    ctx.moveTo(testChargePos.x, testChargePos.y - 6);
    ctx.lineTo(testChargePos.x, testChargePos.y + 6);
    ctx.stroke();
    
    // Point P₀ label
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText('P₀', testChargePos.x + 15, testChargePos.y - 15);
    
  }, [testChargePos, showGaussianSurface, showFieldLines, showFieldVectors, gaussianRadius, trailPoints]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    
    const dist = Math.sqrt((x - testChargePos.x) ** 2 + (y - testChargePos.y) ** 2);
    if (dist < 25) {
      setIsDragging(true);
      // Stop any animation
      animatingRef.current = false;
      setAnimating(false);
      setTrailPoints([]);
      trailRef.current = [];
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(50, Math.min(550, (e.clientX - rect.left) * (canvasRef.current.width / rect.width)));
    const y = Math.max(50, Math.min(450, (e.clientY - rect.top) * (canvasRef.current.height / rect.height)));
    setTestChargePos({ x, y });
    posRef.current = { x, y };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const moveToCenter = () => {
    animatingRef.current = false;
    setAnimating(false);
    setTrailPoints([]);
    trailRef.current = [];
    const newPos = { x: triangleCenter.x, y: triangleCenter.y };
    setTestChargePos(newPos);
    posRef.current = newPos;
  };

  const { magnitude } = calculateField(testChargePos.x, testChargePos.y);
  const isAtCenter = Math.sqrt(
    (testChargePos.x - triangleCenter.x) ** 2 + 
    (testChargePos.y - triangleCenter.y) ** 2
  ) < 15;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/interactive-sims"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 hover:text-white text-sm transition-colors"
          >
            ← Back to Sims
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">
            ⚡ Equilibrium in an Electrostatic Field
          </h1>
          <p className="text-blue-300 italic text-sm mb-3">
            Why stable equilibrium is impossible (Earnshaw's Theorem)
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={moveToCenter}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-medium text-sm"
            >
              ⊙ Move to Center
            </button>
            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-lg text-white font-medium text-sm ${
                animating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {animating ? '⏹ Stop' : '▶ Release Charge!'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          {/* Canvas */}
          <div className="2xl:col-span-2 bg-slate-800 rounded-xl p-3 shadow-xl">
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="rounded-lg cursor-pointer w-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <p className="text-gray-400 text-xs mt-2 text-center">
              Drag the positive test charge (red) to explore • Three negative charges at triangle corners
            </p>
          </div>

          {/* Controls & Info */}
          <div className="space-y-3">
            {/* Field at test charge */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Field at P₀</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>|E| magnitude:</span>
                  <span className="font-mono">{magnitude.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Position:</span>
                  <span className={isAtCenter ? 'text-green-400' : 'text-gray-300'}>
                    {isAtCenter ? '⚠️ At center (unstable!)' : 'Off-center'}
                  </span>
                </div>
                {isAtCenter && (
                  <div className="mt-2 p-2 bg-yellow-900/30 rounded text-yellow-300 text-xs">
                    E ≈ 0 here, but any tiny displacement will cause it to accelerate away!
                  </div>
                )}
              </div>
            </div>

            {/* Gauss's Law Analysis */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Gauss's Law Analysis</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-300">
                  <span className="text-red-400">Red arrows</span>: Field exiting surface<br/>
                  <span className="text-cyan-400">Cyan arrows</span>: Field entering surface
                </div>

                <div className="text-xs p-2 bg-green-900/30 rounded text-green-200">
                  <strong>Gauss's Law (3D):</strong> For any closed surface with no enclosed charge, the total flux in equals the total flux out.
                </div>
                
                <div className="text-xs p-2 bg-yellow-900/30 rounded text-yellow-200">
                  <strong>The contradiction:</strong> Stable equilibrium would require the field to point inward <em>everywhere</em> around P₀ (all cyan arrows). But Gauss's Law says inward and outward flux must balance — impossible if all arrows point inward!
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Controls</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 text-xs">
                  <input
                    type="checkbox"
                    checked={showGaussianSurface}
                    onChange={(e) => setShowGaussianSurface(e.target.checked)}
                    className="rounded w-3 h-3"
                  />
                  Gaussian Surface
                </label>
                <label className="flex items-center gap-2 text-gray-300 text-xs">
                  <input
                    type="checkbox"
                    checked={showFieldLines}
                    onChange={(e) => setShowFieldLines(e.target.checked)}
                    className="rounded w-3 h-3"
                  />
                  Field Lines
                </label>
                <label className="flex items-center gap-2 text-gray-300 text-xs">
                  <input
                    type="checkbox"
                    checked={showFieldVectors}
                    onChange={(e) => setShowFieldVectors(e.target.checked)}
                    className="rounded w-3 h-3"
                  />
                  Field Vectors
                </label>

                <div>
                  <label className="text-gray-300 text-xs block mb-1">
                    Gaussian Radius: {gaussianRadius}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={gaussianRadius}
                    onChange={(e) => setGaussianRadius(Number(e.target.value))}
                    className="w-full h-1"
                  />
                </div>
              </div>
            </div>

            {/* Data Collection */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Data Collection</h3>
              <div className="space-y-2">
                <button
                  onClick={toggleDataCollection}
                  className={`w-full py-2 rounded-lg text-white font-medium text-sm ${
                    collectingData 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {collectingData ? '⏹ Stop Collecting' : '📊 Collect Data'}
                </button>
                
                {collectedData.length > 0 && (
                  <div className="text-xs text-gray-300 text-center">
                    {collectedData.length} snapshots recorded
                  </div>
                )}
                
                <button
                  onClick={downloadData}
                  disabled={collectedData.length === 0}
                  className={`w-full py-2 rounded-lg text-white font-medium text-sm ${
                    collectedData.length > 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  💾 Download JSON
                </button>
                
                {collectingData && (
                  <div className="text-xs p-2 bg-purple-900/30 rounded text-purple-200">
                    Recording: t, charge positions, test charge position, and all field arrow vectors
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Explanation */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4">
          <h3 className="text-base font-semibold text-white mb-2">The Physics: Earnshaw's Theorem</h3>
          <div className="text-gray-300 space-y-2 text-sm">
            <p>
              <strong className="text-yellow-300">Try it:</strong> Move the charge away from the center, then hit "Release". 
              Watch it fly away! The equilibrium is <em>unstable</em>.
            </p>
            <p>
              <strong className="text-blue-300">Why?</strong> For stable equilibrium, a displaced charge must feel a restoring force (E pointing back). 
              This means E must point <em>inward</em> everywhere around P₀ → negative flux through any surrounding surface.
            </p>
            <p>
              <strong className="text-red-300">But Gauss's Law says:</strong> ∮E·dA = Q<sub>enclosed</sub>/ε₀ = 0 (no charge inside). 
              The flux <em>must</em> be zero, not negative. <strong>Contradiction!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectrostaticEquilibrium;
