import React, { useState, useEffect, useRef } from 'react';

// Types
const SEQUENCE_TYPES = {
  monotonic: {
    name: 'Monotonic Convergence',
    description: 'Steady decay toward limit',
    formula: 'xₙ = 1/√n → 0'
  },
  oscillating: {
    name: 'Oscillating Convergence',
    description: 'Damped oscillation',
    formula: 'xₙ = sin(n/5)/√n → 0'
  },
  noisy: {
    name: 'Noisy Convergence',
    description: 'Random sampling with decreasing variance',
    formula: 'Random within shrinking ε-bands'
  }
};

const generateSequence = (type = 'noisy') => {
  const terms = [];

  if (type === 'noisy') {
    const limit = 15;

    // Phase 1: Large epsilon - 24 terms
    for (let i = 0; i < 24; i++) {
      terms.push(limit + (Math.random() - 0.5) * 1.0);
    }
    // Phase 2: Reduced epsilon - 32 terms
    for (let i = 0; i < 32; i++) {
      terms.push(limit + (Math.random() - 0.5) * 0.6);
    }
    // Phase 3: Further reduced - 48 terms
    for (let i = 0; i < 48; i++) {
      terms.push(limit + (Math.random() - 0.5) * 0.3);
    }
    // Phase 4: Even smaller - 48 terms
    for (let i = 0; i < 48; i++) {
      terms.push(limit + (Math.random() - 0.5) * 0.12);
    }
    // Phase 5: Tightest - 48 terms
    for (let i = 0; i < 48; i++) {
      terms.push(limit + (Math.random() - 0.5) * 0.06);
    }

    return { type, limit, terms, ...SEQUENCE_TYPES[type] };
  }

  if (type === 'monotonic') {
    const limit = 0;
    for (let n = 1; n <= 200; n++) {
      terms.push(1 / Math.sqrt(n));
    }
    return { type, limit, terms, ...SEQUENCE_TYPES[type] };
  }

  if (type === 'oscillating') {
    const limit = 0;
    for (let n = 1; n <= 200; n++) {
      terms.push(Math.sin(n / 5) / Math.sqrt(n));
    }
    return { type, limit, terms, ...SEQUENCE_TYPES[type] };
  }

  return generateSequence('noisy');
};

const calculateNThreshold = (sequenceData, epsilon) => {
  const { terms, limit } = sequenceData;

  for (let i = 0; i < terms.length; i++) {
    const n = i + 1;
    let allSubsequentTermsConverge = true;

    for (let j = i; j < terms.length; j++) {
      if (Math.abs(terms[j] - limit) >= epsilon) {
        allSubsequentTermsConverge = false;
        break;
      }
    }

    if (allSubsequentTermsConverge) {
      return n;
    }
  }

  return terms.length + 1;
};

// Sequence Visualizer Component
const SequenceVisualizer = ({ sequenceData, epsilon, nThreshold, selectedPoint, onCanvasClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    const marginLeft = 45;
    const marginRight = 80;
    const marginTop = 55;
    const marginBottom = 55;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    let minValue, maxValue;

    // Use consistent bounds: always show L ± maxEpsilon, extended if data requires
    const maxEpsilon = 0.5;
    const dataMin = Math.min(...sequenceData.terms);
    const dataMax = Math.max(...sequenceData.terms);

    // Start with epsilon bounds around limit
    minValue = sequenceData.limit - maxEpsilon;
    maxValue = sequenceData.limit + maxEpsilon;

    // Extend if data exceeds these bounds
    if (dataMin < minValue) minValue = dataMin - 0.05;
    if (dataMax > maxValue) maxValue = dataMax + 0.05;

    const valueRange = maxValue - minValue;

    const maxN = sequenceData.terms.length;

    const xScale = (n) => marginLeft + (n / maxN) * plotWidth;
    const yScale = (value) =>
      height - marginBottom - ((value - minValue) / valueRange) * plotHeight;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#0a0a0f');
    bgGradient.addColorStop(1, '#12121a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = marginTop + (i / 10) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(width - marginRight, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const x = marginLeft + (i / 10) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, marginTop);
      ctx.lineTo(x, height - marginBottom);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginLeft, height - marginBottom);
    ctx.lineTo(width - marginRight, height - marginBottom);
    ctx.moveTo(marginLeft, height - marginBottom);
    ctx.lineTo(marginLeft, marginTop);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('n', (marginLeft + width - marginRight) / 2, height - 12);

    ctx.save();
    ctx.translate(14, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('xₙ', 0, 0);
    ctx.restore();

    // Epsilon band (convergent region) - starts at N threshold (or hidden in challenge mode)
    const upperBound = sequenceData.limit + epsilon;
    const lowerBound = sequenceData.limit - epsilon;

    // In challenge mode (nThreshold is null), don't show the green band
    if (nThreshold !== null) {
      const bandStartX = nThreshold <= maxN ? xScale(nThreshold) : width - marginRight;

      const bandGradient = ctx.createLinearGradient(0, yScale(upperBound), 0, yScale(lowerBound));
      bandGradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      bandGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
      bandGradient.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
      ctx.fillStyle = bandGradient;
      ctx.fillRect(
        bandStartX,
        yScale(upperBound),
        (width - marginRight) - bandStartX,
        yScale(lowerBound) - yScale(upperBound)
      );
    }

    // Limit line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(marginLeft, yScale(sequenceData.limit));
    ctx.lineTo(width - marginRight, yScale(sequenceData.limit));
    ctx.stroke();
    ctx.setLineDash([]);

    // Epsilon bounds
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(marginLeft, yScale(upperBound));
    ctx.lineTo(width - marginRight, yScale(upperBound));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(marginLeft, yScale(lowerBound));
    ctx.lineTo(width - marginRight, yScale(lowerBound));
    ctx.stroke();

    ctx.setLineDash([]);

    // N threshold line (hidden in challenge mode until answered)
    if (nThreshold !== null && nThreshold <= maxN) {
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(xScale(nThreshold), marginTop);
      ctx.lineTo(xScale(nThreshold), height - marginBottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Connecting lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    sequenceData.terms.forEach((term, index) => {
      const n = index + 1;
      const x = xScale(n);
      const y = yScale(term);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Sequence points
    sequenceData.terms.forEach((term, index) => {
      const n = index + 1;
      const x = xScale(n);
      const y = yScale(term);

      // In challenge mode (nThreshold null), all points are neutral
      const isConvergent = nThreshold !== null && n >= nThreshold;
      const isNeutral = nThreshold === null;

      // Glow effect
      if (isConvergent) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 8);
        glow.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.fillStyle = isNeutral ? '#6b7280' : (isConvergent ? '#10b981' : '#ef4444');
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = isNeutral ? '#4b5563' : (isConvergent ? '#059669' : '#dc2626');
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Labels
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    // L label - positioned to the right of plot, vertically centered on limit line
    ctx.fillStyle = '#f43f5e';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `L = ${sequenceData.limit.toFixed(2)}`,
      width - marginRight + 8,
      yScale(sequenceData.limit)
    );

    // Reset baseline for other labels
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'right';

    ctx.fillStyle = '#10b981';
    ctx.fillText(
      `L + ε = ${upperBound.toFixed(3)}`,
      width - marginRight - 10,
      yScale(upperBound) - 8
    );
    ctx.fillText(
      `L − ε = ${lowerBound.toFixed(3)}`,
      width - marginRight - 10,
      yScale(lowerBound) + 16
    );

    if (nThreshold !== null && nThreshold <= maxN) {
      ctx.fillStyle = '#a78bfa';
      ctx.textAlign = 'left';
      ctx.fillText(
        `N = ${nThreshold}`,
        xScale(nThreshold) + 8,
        marginTop - 10
      );
    }

    // Highlight selected point
    if (selectedPoint !== null) {
      const n = selectedPoint.n;
      const term = sequenceData.terms[selectedPoint.index];
      const x = xScale(n);
      const y = yScale(term);

      // Draw selection ring
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw pulsing glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [sequenceData, epsilon, nThreshold, selectedPoint]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      style={{ minHeight: '400px' }}
      onClick={(e) => onCanvasClick(e, canvasRef)}
    />
  );
};

// Main Simulation Component
export default function SequenceConvergenceSim() {
  const [epsilon, setEpsilon] = useState(0.5);
  const [sequenceType, setSequenceType] = useState('noisy');
  const [sequenceData, setSequenceData] = useState(() => generateSequence('noisy'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 0.5 = slow, 1 = medium, 2 = fast
  const [selectedPoint, setSelectedPoint] = useState(null); // { index, term, distance, withinEpsilon }
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeEpsilon, setChallengeEpsilon] = useState(null);
  const [userN, setUserN] = useState('');
  const [challengeResult, setChallengeResult] = useState(null); // 'correct', 'too_high', null
  const animationRef = useRef(null);

  // Use challenge epsilon when in challenge mode
  const activeEpsilon = challengeMode && challengeEpsilon ? challengeEpsilon : epsilon;
  const nThreshold = calculateNThreshold(sequenceData, activeEpsilon);

  // Speed multipliers: slow = 0.001, medium = 0.003, fast = 0.008
  const speedValues = { 0.5: 0.001, 1: 0.003, 2: 0.008 };

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setEpsilon(prev => {
          const decrement = speedValues[playSpeed];
          const newVal = prev - decrement;
          if (newVal <= 0.01) {
            setIsPlaying(false);
            return 0.01;
          }
          return newVal;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playSpeed]);

  const handlePlayPause = () => {
    if (!isPlaying && epsilon <= 0.01) {
      // Reset to start if at the end
      setEpsilon(0.5);
    }
    setIsPlaying(!isPlaying);
  };

  const handleEpsilonChange = (e) => {
    setIsPlaying(false);
    setEpsilon(parseFloat(e.target.value));
  };

  // Update selected point when epsilon changes
  useEffect(() => {
    if (selectedPoint) {
      const term = sequenceData.terms[selectedPoint.index];
      const distance = Math.abs(term - sequenceData.limit);
      setSelectedPoint({
        ...selectedPoint,
        distance,
        withinEpsilon: distance < activeEpsilon
      });
    }
  }, [activeEpsilon]);

  // Challenge mode functions
  const startChallenge = () => {
    // Generate random epsilon between 0.05 and 0.4
    const randomEpsilon = Math.round((0.05 + Math.random() * 0.35) * 1000) / 1000;
    setChallengeEpsilon(randomEpsilon);
    setChallengeMode(true);
    setUserN('');
    setChallengeResult(null);
    setSelectedPoint(null);
  };

  const checkAnswer = () => {
    const userNValue = parseInt(userN);
    if (isNaN(userNValue) || userNValue < 1) {
      return;
    }

    const correctN = nThreshold;

    if (userNValue >= correctN) {
      setChallengeResult('correct');
    } else {
      setChallengeResult('too_low');
    }
  };

  const exitChallenge = () => {
    setChallengeMode(false);
    setChallengeEpsilon(null);
    setUserN('');
    setChallengeResult(null);
  };

  const nextChallenge = () => {
    startChallenge();
  };

  const handleCanvasClick = (e, canvasRef) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const marginLeft = 45;
    const marginRight = 80;
    const marginTop = 55;
    const marginBottom = 55;
    const plotWidth = width - marginLeft - marginRight;
    const plotHeight = height - marginTop - marginBottom;

    let minValue, maxValue;
    const maxEpsilon = 0.5;
    const dataMin = Math.min(...sequenceData.terms);
    const dataMax = Math.max(...sequenceData.terms);

    minValue = sequenceData.limit - maxEpsilon;
    maxValue = sequenceData.limit + maxEpsilon;

    if (dataMin < minValue) minValue = dataMin - 0.05;
    if (dataMax > maxValue) maxValue = dataMax + 0.05;

    const valueRange = maxValue - minValue;
    const maxN = sequenceData.terms.length;

    const xScale = (n) => marginLeft + (n / maxN) * plotWidth;
    const yScale = (value) => height - marginBottom - ((value - minValue) / valueRange) * plotHeight;

    // Find closest point
    let closestIndex = -1;
    let closestDist = Infinity;

    sequenceData.terms.forEach((term, index) => {
      const n = index + 1;
      const px = xScale(n);
      const py = yScale(term);
      const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);

      if (dist < closestDist && dist < 20) { // 20px threshold
        closestDist = dist;
        closestIndex = index;
      }
    });

    if (closestIndex >= 0) {
      const term = sequenceData.terms[closestIndex];
      const distance = Math.abs(term - sequenceData.limit);
      setSelectedPoint({
        index: closestIndex,
        n: closestIndex + 1,
        term,
        distance,
        withinEpsilon: distance < activeEpsilon
      });
    } else {
      setSelectedPoint(null);
    }
  };

  const generateNewSequence = () => {
    setSequenceData(generateSequence(sequenceType));
    setSelectedPoint(null);
  };

  const handleSequenceTypeChange = (type) => {
    setSequenceType(type);
    setSequenceData(generateSequence(type));
    setSelectedPoint(null);
    setEpsilon(0.5);
  };

  const convergentCount = sequenceData.terms.filter((_, index) => index + 1 >= nThreshold).length;
  const totalTerms = sequenceData.terms.length;

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm mb-2">
          Interactive exploration of the ε-N definition:
        </p>
        <p className="font-mono text-2xl font-bold text-rose-500 mb-6">
          ∀ε &gt; 0, ∃N ∈ ℕ such that n ≥ N ⟹ |xₙ − L| &lt; ε
        </p>

        {/* Philosophy Box */}
        <div className="rounded-xl p-5 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-emerald-500/10 border border-cyan-400/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-cyan-400 font-semibold text-lg mb-2">Philosophy</h3>
              <p className="text-slate-300 text-base leading-relaxed">
                This sim assumes you've seen the definition — now it's time to <em className="text-emerald-400 not-italic font-medium">feel</em> it.
                Drag the slider, watch the ε-band shrink, see N shift rightward. Build intuition for what "eventual capture" really means.
                This isn't about discovering the definition from scratch; it's about making the abstraction <em className="text-violet-400 not-italic font-medium">visceral</em>.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-3 italic">
                For the computational thinkers: the definition is the <span className="text-cyan-400 not-italic font-medium">specification</span>, this simulation is the <span className="text-cyan-400 not-italic font-medium">implementation</span>.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mt-3">
                Master this, and you unlock Real Analysis — the foundation for advanced math, theoretical physics, and yes, even machine learning.
              </p>
            </div>
          </div>
        </div>

        {/* Sequence Selector - Horizontal */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2 text-cyan-400">
            Choose a Sequence
          </h3>

          {/* Wrapper to align difficulty indicator with buttons */}
          <div className="inline-flex flex-col">
            {/* Obviousness indicator */}
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
              <span className="text-emerald-400 font-medium">Obvious</span>
              <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400 opacity-50" />
              <span className="text-rose-400 font-medium">Subtle</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.entries(SEQUENCE_TYPES).map(([key, { name, formula }]) => (
                <button
                  key={key}
                  onClick={() => handleSequenceTypeChange(key)}
                  className={`px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    sequenceType === key
                      ? 'bg-gradient-to-r from-cyan-600/40 to-emerald-600/40 border border-cyan-400/50'
                      : 'bg-white/5 hover:bg-slate-700/50 border border-transparent'
                  }`}
                  style={sequenceType === key ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' } : {}}
                >
                  <div className="font-medium text-sm text-white">{name}</div>
                  <div className="font-mono text-xs text-slate-400 mt-1">{formula}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Main Canvas + Legend Row */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Canvas */}
          <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
          {/* Convergent Progress Bar */}
          {(!challengeMode || challengeResult) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Convergent</span>
              <span className="font-mono text-lg font-semibold text-emerald-400">
                {`${convergentCount}/${totalTerms}`}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${(convergentCount / totalTerms) * 100}%` }}
              />
            </div>
          </div>
          )}

          <div className="h-[500px]">
            <SequenceVisualizer
              sequenceData={sequenceData}
              epsilon={activeEpsilon}
              nThreshold={challengeMode && !challengeResult ? null : nThreshold}
              selectedPoint={selectedPoint}
              onCanvasClick={handleCanvasClick}
            />
          </div>

          {/* Selected Point Info */}
          {selectedPoint && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold text-amber-400">Selected Point</span>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="ml-auto text-slate-500 hover:text-slate-300 text-sm"
                >
                  ✕ Clear
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
                <div>
                  <span className="text-slate-500 block">Index</span>
                  <span className="text-white text-lg">n = {selectedPoint.n}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Value</span>
                  <span className="text-white text-lg">x<sub>n</sub> = {selectedPoint.term.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Distance from L</span>
                  <span className="text-white text-lg">|x<sub>n</sub> − L| = {selectedPoint.distance.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Within ε?</span>
                  <span className={`text-lg font-semibold ${selectedPoint.withinEpsilon ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedPoint.withinEpsilon ? '✓ Yes' : '✗ No'}
                    <span className="text-slate-500 font-normal text-xs ml-1">
                      ({selectedPoint.distance.toFixed(4)} {selectedPoint.withinEpsilon ? '<' : '≥'} {activeEpsilon.toFixed(3)})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Right Column - Legend + Challenge Mode */}
          <div className="lg:w-72 flex flex-col gap-6">
            {/* Legend */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-lg mb-4 text-slate-300">
                Legend
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Convergent (n ≥ N)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-400">Non-convergent (n &lt; N)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5 bg-rose-500" style={{ borderStyle: 'dashed' }} />
                  <span className="text-slate-400">Limit line (L)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 bg-emerald-500/20 border border-emerald-500/40 rounded" />
                  <span className="text-slate-400">ε-band</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5 bg-violet-400" style={{ borderStyle: 'dashed' }} />
                  <span className="text-slate-400">N threshold</span>
                </div>
              </div>
            </div>

            {/* Challenge Mode Toggle */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-amber-400">
                  🎯 Challenge Mode
                </h3>
                <button
                  onClick={challengeMode ? exitChallenge : startChallenge}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    challengeMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500'
                  }`}
                >
                  {challengeMode ? 'Exit' : 'Start'}
                </button>
              </div>

              {challengeMode ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-300 text-sm mb-1">I challenge you with:</p>
                        <p className="font-mono text-2xl text-amber-400 font-bold">ε = {challengeEpsilon?.toFixed(3)}</p>
                      </div>
                      <button
                        onClick={startChallenge}
                        className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition-all"
                        title="New challenge"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Find the smallest N such that ∀n ≥ N, |xₙ − L| &lt; ε</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={userN}
                        onChange={(e) => {
                          setUserN(e.target.value);
                          setChallengeResult(null);
                        }}
                        placeholder="Enter N..."
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white font-mono focus:outline-none focus:border-amber-400"
                        disabled={challengeResult === 'correct'}
                      />
                      <button
                        onClick={checkAnswer}
                        disabled={!userN || challengeResult === 'correct'}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-500 hover:to-orange-500 transition-all"
                      >
                        Check
                      </button>
                    </div>
                  </div>

                  {challengeResult && (
                    <div className={`p-3 rounded-lg ${
                      challengeResult === 'correct'
                        ? 'bg-emerald-500/20 border border-emerald-400/50'
                        : 'bg-rose-500/20 border border-rose-400/50'
                    }`}>
                      {challengeResult === 'correct' ? (
                        <div>
                          <p className="text-emerald-400 font-semibold">✓ Correct!</p>
                          <p className="text-slate-400 text-sm mt-1">
                            N = {nThreshold} is the smallest value. Your answer N = {userN} works because all subsequent terms stay within ε.
                          </p>
                          <button
                            onClick={nextChallenge}
                            className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all"
                          >
                            Next Challenge →
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-rose-400 font-semibold">✗ Too low!</p>
                          <p className="text-slate-400 text-sm mt-1">
                            With N = {userN}, some terms after n = {userN} still escape the ε-band. Try a larger N.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">
                  <p>Test your understanding! I'll give you an ε, you find the N.</p>
                  <p className="mt-2 font-bold text-white"><span className="text-amber-400">Hint:</span> Use the interactive plus sign clicker to solve the challenge.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Epsilon Control - locked when in challenge mode */}
          <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 ${
            challengeMode ? 'opacity-40 pointer-events-none' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-emerald-400">
                Tolerance (ε)
              </h3>
              {challengeMode && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Locked
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="font-mono text-3xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {epsilon.toFixed(3)}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  disabled={challengeMode}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isPlaying ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>

                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.005"
                  value={0.51 - epsilon}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setEpsilon(0.51 - parseFloat(e.target.value));
                  }}
                  disabled={challengeMode}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #f43f5e 100%)'
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500 font-mono mt-2 ml-13">
                <span className="ml-13">0.500</span>
                <span>0.010</span>
              </div>
            </div>

            {/* Speed Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Animation Speed</span>
              </div>
              <div className="flex gap-2">
                {[
                  { value: 0.5, label: 'Slow' },
                  { value: 1, label: 'Medium' },
                  { value: 2, label: 'Fast' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPlaySpeed(value)}
                    disabled={challengeMode}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                      playSpeed === value
                        ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {isPlaying ? 'Playing... click pause or drag slider to stop' : 'Press play or drag to explore convergence'}
            </p>
          </div>

          {/* Generate Button - only show for noisy sequence */}
          {sequenceType === 'noisy' && (
            <button
              onClick={generateNewSequence}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all duration-200"
              style={{ boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)' }}
            >
              Regenerate Random Sequence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
