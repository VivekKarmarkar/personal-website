import React, { useState, useEffect, useRef } from 'react';

const ProjectileMotion = () => {
  const canvasRef = useRef(null);
  
  // Physics scale: 1 meter = 20 pixels
  const SCALE = 20;
  const groundY = 420;
  const launchX = 50;
  
  // Simulation state
  const [launched, setLaunched] = useState(false);
  const [position, setPosition] = useState({ x: launchX, y: groundY });
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [trail, setTrail] = useState([]);
  
  // Controls
  const [launchAngle, setLaunchAngle] = useState(45);
  const [launchSpeed, setLaunchSpeed] = useState(15); // m/s
  const [damping, setDamping] = useState(false);
  const [wind, setWind] = useState(0); // m/s^2 (acceleration due to wind)
  
  // Data collection
  const [collectingData, setCollectingData] = useState(false);
  const [collectedData, setCollectedData] = useState([]);
  const collectingDataRef = useRef(false);
  const collectedDataRef = useRef([]);
  const timeRef = useRef(0);
  const dataCollectionRef = useRef(null);
  
  // Animation refs
  const animationRef = useRef(null);
  const posRef = useRef({ x: launchX, y: groundY });
  const velRef = useRef({ vx: 0, vy: 0 });
  const trailRef = useRef([]);
  const launchedRef = useRef(false);
  const dampingRef = useRef(false);
  const windRef = useRef(0);
  
  // Physics constants (in real units: meters, seconds)
  const g = 9.8; // m/s^2
  const e = 0.5; // Coefficient of restitution
  const dt = 1/60; // seconds per frame
  const dragCoeff = 0.3; // 1/s (linear drag coefficient)
  
  // Keep refs in sync
  useEffect(() => {
    dampingRef.current = damping;
  }, [damping]);
  
  useEffect(() => {
    windRef.current = wind;
  }, [wind]);
  
  // Convert physics coords (meters, y-up) to canvas coords (pixels, y-down)
  const toCanvas = (xMeters, yMeters) => ({
    x: launchX + xMeters * SCALE,
    y: groundY - yMeters * SCALE
  });
  
  // Convert canvas coords to physics coords
  const toPhysics = (xCanvas, yCanvas) => ({
    x: (xCanvas - launchX) / SCALE,
    y: (groundY - yCanvas) / SCALE
  });
  
  // Physics simulation (all in real units)
  const simulate = () => {
    if (!launchedRef.current) {
      animationRef.current = requestAnimationFrame(simulate);
      return;
    }
    
    // Get current state in physics units
    let canvasPos = posRef.current;
    let phys = toPhysics(canvasPos.x, canvasPos.y);
    let vx = velRef.current.vx; // m/s
    let vy = velRef.current.vy; // m/s (positive = up)
    
    // Apply gravity (downward)
    vy -= g * dt;
    
    // Apply wind (horizontal acceleration)
    vx += windRef.current * dt;
    
    // Apply damping if enabled (linear drag: a = -b*v)
    if (dampingRef.current) {
      vx *= (1 - dragCoeff * dt);
      vy *= (1 - dragCoeff * dt);
    }
    
    // Update position
    phys.x += vx * dt;
    phys.y += vy * dt;
    
    // Ground collision (y = 0)
    if (phys.y <= 0) {
      phys.y = 0;
      vy = -vy * e;
      vx = vx * 0.95; // friction
      
      if (Math.abs(vy) < 0.3) {
        vy = 0;
        if (Math.abs(vx) < 0.1) {
          vx = 0;
          launchedRef.current = false;
          setLaunched(false);
        }
      }
    }
    
    // Wall collisions (in physics units)
    const leftWall = -launchX / SCALE; // ~-2.5m
    const rightWall = (800 - launchX) / SCALE; // ~37.5m
    const ceiling = groundY / SCALE; // ~21m
    
    if (phys.x < leftWall + 0.5) {
      phys.x = leftWall + 0.5;
      vx = Math.abs(vx) * e;
    }
    if (phys.x > rightWall - 0.5) {
      phys.x = rightWall - 0.5;
      vx = -Math.abs(vx) * e;
    }
    if (phys.y > ceiling - 1) {
      phys.y = ceiling - 1;
      vy = -Math.abs(vy) * e;
    }
    
    // Convert back to canvas coords
    const newCanvasPos = toCanvas(phys.x, phys.y);
    
    // Update refs
    posRef.current = newCanvasPos;
    velRef.current = { vx, vy };
    
    // Add to trail
    trailRef.current.push({ ...newCanvasPos });
    
    // Update state for render
    setPosition(newCanvasPos);
    setVelocity({ vx, vy });
    setTrail([...trailRef.current]);
    
    animationRef.current = requestAnimationFrame(simulate);
  };
  
  // Launch projectile
  const launch = () => {
    const angleRad = (launchAngle * Math.PI) / 180;
    const vx = launchSpeed * Math.cos(angleRad); // m/s
    const vy = launchSpeed * Math.sin(angleRad); // m/s (positive = up)
    
    const startPos = { x: launchX, y: groundY };
    posRef.current = startPos;
    velRef.current = { vx, vy };
    trailRef.current = [{ ...startPos }];
    
    setPosition(startPos);
    setVelocity({ vx, vy });
    setTrail([{ ...startPos }]);
    
    launchedRef.current = true;
    setLaunched(true);
  };
  
  // Reset
  const reset = () => {
    launchedRef.current = false;
    setLaunched(false);
    posRef.current = { x: launchX, y: groundY };
    velRef.current = { vx: 0, vy: 0 };
    trailRef.current = [];
    setPosition({ x: launchX, y: groundY });
    setVelocity({ vx: 0, vy: 0 });
    setTrail([]);
  };
  
  // Data collection loop - runs independently at ~30fps
  const dataCollectionLoop = () => {
    if (!collectingDataRef.current) return;
    
    const canvasPos = posRef.current;
    const phys = toPhysics(canvasPos.x, canvasPos.y);
    
    const snapshot = {
      t: parseFloat((timeRef.current * 0.033).toFixed(4)),
      x: parseFloat(phys.x.toFixed(4)),
      y: parseFloat(Math.max(0, phys.y).toFixed(4))
    };
    
    collectedDataRef.current.push(snapshot);
    setCollectedData([...collectedDataRef.current]);
    timeRef.current += 1;
    
    dataCollectionRef.current = setTimeout(dataCollectionLoop, 33);
  };
  
  // Toggle data collection
  const toggleDataCollection = () => {
    if (collectingData) {
      collectingDataRef.current = false;
      setCollectingData(false);
      if (dataCollectionRef.current) clearTimeout(dataCollectionRef.current);
    } else {
      collectedDataRef.current = [];
      setCollectedData([]);
      timeRef.current = 0;
      collectingDataRef.current = true;
      setCollectingData(true);
      dataCollectionLoop();
    }
  };
  
  // Download data as JSON
  const downloadData = () => {
    if (collectedData.length === 0) {
      alert('No data collected yet.');
      return;
    }
    const dataStr = JSON.stringify(collectedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projectile_data_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Start simulation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(simulate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (dataCollectionRef.current) clearTimeout(dataCollectionRef.current);
    };
  }, []);
  
  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += SCALE * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += SCALE * 2) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Wind indicator
    if (wind !== 0) {
      const windArrowY = 30;
      const windArrowX = width / 2;
      const windLength = wind * 15;
      
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(windArrowX - windLength, windArrowY);
      ctx.lineTo(windArrowX + windLength, windArrowY);
      ctx.stroke();
      
      // Arrowhead
      const arrowDir = wind > 0 ? 1 : -1;
      const tipX = windArrowX + windLength;
      ctx.beginPath();
      ctx.moveTo(tipX, windArrowY);
      ctx.lineTo(tipX - arrowDir * 10, windArrowY - 6);
      ctx.lineTo(tipX - arrowDir * 10, windArrowY + 6);
      ctx.closePath();
      ctx.fill();
      
      // Wind label
      ctx.font = '14px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(`Wind: ${wind > 0 ? '→' : '←'} ${Math.abs(wind).toFixed(1)} m/s²`, windArrowX, windArrowY + 25);
    }
    
    // Ground
    ctx.fillStyle = '#1e3a2f';
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
    
    // Grass tufts
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    for (let x = 10; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x - 3, groundY + 8);
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + 3, groundY + 8);
      ctx.stroke();
    }
    
    // Scale marker
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(launchX, groundY + 40);
    ctx.lineTo(launchX + SCALE * 5, groundY + 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(launchX, groundY + 35);
    ctx.lineTo(launchX, groundY + 45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(launchX + SCALE * 5, groundY + 35);
    ctx.lineTo(launchX + SCALE * 5, groundY + 45);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('5 m', launchX + SCALE * 2.5, groundY + 58);
    
    // Launch indicator (when not launched)
    if (!launched) {
      const angleRad = (launchAngle * Math.PI) / 180;
      const indicatorLength = launchSpeed * 4;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(launchX, groundY);
      ctx.lineTo(
        launchX + indicatorLength * Math.cos(angleRad),
        groundY - indicatorLength * Math.sin(angleRad)
      );
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Arrowhead
      const endX = launchX + indicatorLength * Math.cos(angleRad);
      const endY = groundY - indicatorLength * Math.sin(angleRad);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 10 * Math.cos(angleRad - 0.3), endY + 10 * Math.sin(angleRad - 0.3));
      ctx.lineTo(endX - 10 * Math.cos(angleRad + 0.3), endY + 10 * Math.sin(angleRad + 0.3));
      ctx.closePath();
      ctx.fill();
    }
    
    // Trail
    if (trail.length > 1) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.stroke();
    }
    
    // Projectile glow
    const gradient = ctx.createRadialGradient(
      position.x, position.y, 0,
      position.x, position.y, 25
    );
    gradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Projectile ball
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(position.x, position.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Velocity vector
    const speed = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy);
    if (launched && speed > 0.5) {
      const arrowScale = 3;
      const vxCanvas = velocity.vx * arrowScale;
      const vyCanvas = -velocity.vy * arrowScale; // flip for canvas coords
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + vxCanvas, position.y + vyCanvas);
      ctx.stroke();
      
      const vAngle = Math.atan2(vyCanvas, vxCanvas);
      const endX = position.x + vxCanvas;
      const endY = position.y + vyCanvas;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 8 * Math.cos(vAngle - 0.4), endY - 8 * Math.sin(vAngle - 0.4));
      ctx.lineTo(endX - 8 * Math.cos(vAngle + 0.4), endY - 8 * Math.sin(vAngle + 0.4));
      ctx.closePath();
      ctx.fill();
    }
    
  }, [position, trail, launched, launchAngle, launchSpeed, velocity, wind]);
  
  // Get physics values for display
  const phys = toPhysics(position.x, position.y);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">🎯 Projectile Motion</h1>
          <p className="text-amber-300 italic text-sm mb-3">
            Bouncing (e=0.5) • Optional damping • Wind
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={launch}
              disabled={launched}
              className={`px-4 py-2 rounded-lg text-white font-medium text-sm ${
                launched ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              🚀 Launch!
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-medium text-sm"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-800 rounded-xl p-3 shadow-xl">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="rounded-lg w-full"
            />
          </div>

          <div className="space-y-3">
            {/* Current State */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Current State</h3>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-gray-300">
                  <span>x:</span>
                  <span className="text-amber-400">{phys.x.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>y:</span>
                  <span className="text-amber-400">{Math.max(0, phys.y).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>vₓ:</span>
                  <span className="text-red-400">{velocity.vx.toFixed(2)} m/s</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>vᵧ:</span>
                  <span className="text-red-400">{velocity.vy.toFixed(2)} m/s</span>
                </div>
              </div>
            </div>

            {/* Launch Parameters */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Launch</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-300 text-xs block mb-1">
                    Angle: {launchAngle}°
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={launchAngle}
                    onChange={(e) => setLaunchAngle(Number(e.target.value))}
                    disabled={launched}
                    className="w-full h-2"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-xs block mb-1">
                    Speed: {launchSpeed} m/s
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={launchSpeed}
                    onChange={(e) => setLaunchSpeed(Number(e.target.value))}
                    disabled={launched}
                    className="w-full h-2"
                  />
                </div>
              </div>
            </div>

            {/* Physics Toggles */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Physics</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={damping}
                    onChange={(e) => setDamping(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className={`text-sm ${damping ? 'text-amber-400 font-semibold' : 'text-gray-300'}`}>
                    🌫️ Air Resistance
                  </span>
                </label>
                
                <div>
                  <label className="text-gray-300 text-xs block mb-1">
                    🌬️ Wind: {wind > 0 ? '+' : ''}{wind.toFixed(1)} m/s²
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={wind}
                    onChange={(e) => setWind(Number(e.target.value))}
                    className="w-full h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>← Headwind</span>
                    <span>Tailwind →</span>
                  </div>
                </div>
                
                <div className={`text-xs p-2 rounded ${
                  damping || wind !== 0 
                    ? 'bg-amber-900/30 text-amber-200' 
                    : 'bg-green-900/30 text-green-200'
                }`}>
                  {damping && wind !== 0 
                    ? `Damping + Wind (${wind > 0 ? 'tailwind' : 'headwind'})`
                    : damping 
                      ? 'Damping only'
                      : wind !== 0 
                        ? `Wind only (${wind > 0 ? 'tailwind' : 'headwind'})`
                        : 'Ideal: No drag, no wind'}
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
                  {collectingData ? '⏹ Stop' : '📊 Collect Data'}
                </button>
                {collectedData.length > 0 && (
                  <div className="text-xs text-gray-300 text-center">
                    {collectedData.length} points
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
              </div>
            </div>

            {/* Constants */}
            <div className="bg-slate-800 rounded-xl p-3">
              <h3 className="text-white font-semibold mb-2 text-sm">Constants</h3>
              <div className="text-xs text-gray-300 space-y-1 font-mono">
                <div>g = 9.8 m/s²</div>
                <div>e = 0.5</div>
                <div>b = 0.3 /s (drag)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
