import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-tomorrow.css'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, ComposedChart
} from 'recharts'
import NeuralNetLegoSim from '../../sims/ml/NeuralNetLegoSim'

// Syntax highlighting function
const highlightCode = (code) => {
  return Prism.highlight(code, Prism.languages.python, 'python')
}

// Parse chart data from Python output
const parseChartData = (output) => {
  if (!output) return null
  try {
    // Look for JSON chart data marker
    const chartMatch = output.match(/<<<CHART_DATA>>>([\s\S]*?)<<<\/CHART_DATA>>>/)
    if (chartMatch) {
      return JSON.parse(chartMatch[1])
    }
  } catch (e) {
    console.error('Failed to parse chart data:', e)
  }
  return null
}

// Strip chart data from output text
const stripChartData = (output) => {
  if (!output) return output
  return output.replace(/<<<CHART_DATA>>>[\s\S]*?<<<\/CHART_DATA>>>/g, '').trim()
}

// Chart component
const ChartDisplay = ({ chartData }) => {
  if (!chartData) return null

  const { type, data, config } = chartData

  if (type === 'line') {
    return (
      <div className="bg-[#0d1117] rounded-lg p-4 my-4">
        <div className="text-white text-sm font-medium mb-2">{config?.title || 'Chart'}</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="x" stroke="#888" tick={{ fill: '#888' }} label={{ value: config?.xlabel, position: 'bottom', fill: '#888' }} />
            <YAxis stroke="#888" tick={{ fill: '#888' }} label={{ value: config?.ylabel, angle: -90, position: 'insideLeft', fill: '#888' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            {config?.lines?.map((line, i) => (
              <Line key={i} type="monotone" dataKey={line.key} stroke={line.color || '#FCCC0A'} dot={false} name={line.name} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'scatter') {
    const formatTick = (value) => typeof value === 'number' ? value.toFixed(1) : value
    return (
      <div className="bg-[#0d1117] rounded-lg p-4 my-4">
        <div className="text-white text-sm font-medium mb-2">{config?.title || 'Chart'}</div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="x" stroke="#888" tick={{ fill: '#888' }} name={config?.xlabel} tickFormatter={formatTick} />
            <YAxis dataKey="y" stroke="#888" tick={{ fill: '#888' }} name={config?.ylabel} tickFormatter={formatTick} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={config?.title} data={data} fill="#FCCC0A" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'scatter_line') {
    const formatTick = (value) => typeof value === 'number' ? value.toFixed(1) : value
    return (
      <div className="bg-[#0d1117] rounded-lg p-4 my-4">
        <div className="text-white text-sm font-medium mb-2">{config?.title || 'Chart'}</div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="x" stroke="#888" tick={{ fill: '#888' }} tickFormatter={formatTick} />
            <YAxis stroke="#888" tick={{ fill: '#888' }} tickFormatter={formatTick} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Legend />
            <Scatter name={config?.scatter_name || 'Data'} dataKey="actual" fill="#FCCC0A" />
            <Line type="monotone" dataKey="predicted" stroke="#ff6b6b" dot={false} name={config?.line_name || 'Prediction'} strokeWidth={4} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Animated training visualization
  if (type === 'animated_training') {
    return <AnimatedTrainingChart data={data} config={config} />
  }

  return null
}

// Animated Training Chart Component
const AnimatedTrainingChart = ({ data, config }) => {
  const [frame, setFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50) // ms per frame
  const intervalRef = useRef(null)

  const { checkpoints, loss_history, ground_truth, epochs_per_loss_sample } = data
  const totalFrames = checkpoints?.length || 0

  useEffect(() => {
    if (isPlaying && frame < totalFrames - 1) {
      intervalRef.current = setTimeout(() => {
        setFrame(f => f + 1)
      }, speed)
    } else if (frame >= totalFrames - 1) {
      setIsPlaying(false)
    }
    return () => clearTimeout(intervalRef.current)
  }, [isPlaying, frame, totalFrames, speed])

  const handlePlay = () => {
    if (frame >= totalFrames - 1) setFrame(0)
    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)
  const handleReset = () => { setIsPlaying(false); setFrame(0) }
  const handleStepForward = () => { setIsPlaying(false); setFrame(f => Math.min(f + 1, totalFrames - 1)) }
  const handleStepBackward = () => { setIsPlaying(false); setFrame(f => Math.max(f - 1, 0)) }
  const handleSkipForward = () => { setIsPlaying(false); setFrame(f => Math.min(f + 10, totalFrames - 1)) }
  const handleSkipBackward = () => { setIsPlaying(false); setFrame(f => Math.max(f - 10, 0)) }

  if (!checkpoints || checkpoints.length === 0) return null

  const currentCheckpoint = checkpoints[frame]
  const currentEpoch = currentCheckpoint?.epoch || 0
  const currentLoss = currentCheckpoint?.loss || 0

  // Build prediction data for current frame
  const predictionData = ground_truth.map((pt, i) => ({
    x: pt.x,
    actual: pt.y,
    predicted: currentCheckpoint?.predictions?.[i] || 0
  }))

  // Build loss curve data up to current frame - use actual epoch numbers
  const lossDataEndIndex = Math.floor(currentEpoch / (epochs_per_loss_sample || 1))
  const lossData = loss_history?.slice(0, lossDataEndIndex + 1).map((loss, i) => ({
    epoch: i * (epochs_per_loss_sample || 1),
    loss: loss
  })) || []

  // Format tick values to 1 decimal place
  const formatTick = (value) => value.toFixed(1)

  return (
    <div className="bg-[#0d1117] rounded-lg p-4 my-4">
      <div className="text-white text-sm font-medium mb-4">{config?.title || 'Training Animation'}</div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSkipBackward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Skip backward 10 frames"
          >
            ⏪
          </button>
          <button
            onClick={handleStepBackward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Step backward"
          >
            ◀
          </button>
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              ⏸
            </button>
          )}
          <button
            onClick={handleStepForward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Step forward"
          >
            ▶
          </button>
          <button
            onClick={handleSkipForward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Skip forward 10 frames"
          >
            ⏩
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors ml-1"
            title="Reset"
          >
            ↺
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-dark-muted text-xs">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-neutral-800 text-white text-xs rounded px-2 py-1 border border-neutral-700"
          >
            <option value={150}>0.5x</option>
            <option value={75}>1x</option>
            <option value={40}>2x</option>
            <option value={20}>4x</option>
          </select>
        </div>

        {/* Epoch display */}
        <div className="ml-auto text-right">
          <span className="text-accent font-mono text-sm font-bold">Epoch {currentEpoch}</span>
          <span className="text-dark-muted text-xs ml-2">Loss: {currentLoss.toFixed(4)}</span>
        </div>
      </div>

      {/* Slider - full width */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={frame}
          onChange={(e) => setFrame(Number(e.target.value))}
          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-dark-muted text-xs mt-1">
          <span>Epoch 0</span>
          <span>Epoch {checkpoints[totalFrames - 1]?.epoch || 0}</span>
        </div>
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Loss curve */}
        <div>
          <div className="text-dark-muted text-xs mb-2">Loss History</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lossData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="epoch"
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
              />
              <YAxis
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                tickFormatter={(v) => v.toFixed(2)}
                width={45}
              />
              <Line type="monotone" dataKey="loss" stroke="#FCCC0A" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction vs actual */}
        <div>
          <div className="text-dark-muted text-xs mb-2">Network Prediction vs Ground Truth</div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={predictionData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="x"
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                tickFormatter={formatTick}
              />
              <YAxis
                stroke="#888"
                tick={{ fill: '#888', fontSize: 10 }}
                domain={[-1.2, 1.2]}
                tickFormatter={formatTick}
                width={35}
              />
              <Scatter name="sin(x)" dataKey="actual" fill="#FCCC0A" isAnimationActive={false} />
              <Line type="monotone" dataKey="predicted" stroke="#ff6b6b" dot={false} strokeWidth={4} name="NN" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Simple markdown-like renderer for explanations
const renderExplanation = (text) => {
  const paragraphs = text.split('\n\n')

  return paragraphs.map((para, i) => {
    // Check if it's a code block
    if (para.startsWith('```')) {
      const code = para.replace(/```python?\n?/g, '').replace(/```/g, '')
      return (
        <pre key={i} className="bg-[#0d1117] rounded-lg p-4 my-4 overflow-x-auto">
          <code className="text-sm font-mono text-gray-300">{code}</code>
        </pre>
      )
    }

    // Check if it's a list
    if (para.match(/^[\d-]/m)) {
      const items = para.split('\n').filter(line => line.trim())
      return (
        <ul key={i} className="space-y-2 my-4">
          {items.map((item, j) => (
            <li key={j} className="flex gap-3 text-dark-muted leading-relaxed">
              <span className="text-accent shrink-0">{item.match(/^\d/) ? item.match(/^\d+/)[0] + '.' : '•'}</span>
              <span dangerouslySetInnerHTML={{
                __html: item.replace(/^[\d\-\.\*]+\s*/, '')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
                  .replace(/`([^`]+)`/g, '<code class="bg-neutral-800 px-1.5 py-0.5 rounded text-accent text-sm font-mono">$1</code>')
              }} />
            </li>
          ))}
        </ul>
      )
    }

    // Regular paragraph with inline formatting
    return (
      <p
        key={i}
        className="text-dark-muted leading-relaxed my-4 first:mt-0 last:mb-0"
        dangerouslySetInnerHTML={{
          __html: para
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-neutral-800 px-1.5 py-0.5 rounded text-accent text-sm font-mono">$1</code>')
        }}
      />
    )
  })
}

// Dynamic Code Section Component - Tom Riddle's Diary style
const DynamicCodeSection = ({ section, onRunCode, kernelReady }) => {
  const [currentLine, setCurrentLine] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800) // ms per line
  const [charIndex, setCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef(null)
  const typingRef = useRef(null)
  const codeContainerRef = useRef(null)
  const containerRef = useRef(null)

  const lines = section.code.split('\n')
  const totalLines = lines.length
  const lineExplanations = section.lineExplanations || []

  // Calculate optimal divider position based on longest line
  const longestLineLength = useMemo(() => {
    return Math.max(...lines.map(line => line.length))
  }, [lines])

  // Calculate initial code pane width: ~8.4px per char at 14px font, plus line numbers (~50px) and padding (~40px)
  const calculateInitialCodeWidth = () => {
    const charWidth = 8.4
    const lineNumberWidth = 50
    const padding = 60
    const codeWidth = longestLineLength * charWidth + lineNumberWidth + padding
    // Clamp between 30% and 75% of container
    const minPercent = 30
    const maxPercent = 75
    // Estimate container width as viewport - some margin
    const estimatedContainer = window.innerWidth - 60
    const percent = Math.min(maxPercent, Math.max(minPercent, (codeWidth / estimatedContainer) * 100))
    return percent
  }

  const [dividerPercent, setDividerPercent] = useState(() => calculateInitialCodeWidth())

  // User has completed the walkthrough when they've seen all lines
  const hasCompletedWalkthrough = currentLine >= totalLines - 1 && !isTyping

  // Get visible code (lines 0 to currentLine)
  const visibleCode = currentLine >= 0
    ? lines.slice(0, currentLine + 1).map((line, i) => {
        // If this is the current line and we're typing, show partial
        if (i === currentLine && isTyping) {
          return line.slice(0, charIndex)
        }
        return line
      }).join('\n')
    : ''

  // Get current explanation based on currentLine
  const getCurrentExplanation = () => {
    if (currentLine < 0) return null
    // Find the explanation that covers the current line
    for (const exp of lineExplanations) {
      const [start, end] = exp.lines
      if (currentLine >= start && currentLine <= end) {
        return exp
      }
    }
    return null
  }

  const currentExplanation = getCurrentExplanation()

  // Typing effect for current line
  useEffect(() => {
    if (isTyping && currentLine >= 0 && currentLine < totalLines) {
      const currentLineText = lines[currentLine]
      if (charIndex < currentLineText.length) {
        typingRef.current = setTimeout(() => {
          setCharIndex(c => c + 1)
        }, 20) // typing speed
      } else {
        // Done typing this line
        setIsTyping(false)
        setCharIndex(0)
      }
    }
    return () => clearTimeout(typingRef.current)
  }, [isTyping, charIndex, currentLine, lines, totalLines])

  // Auto-advance to next line when playing
  useEffect(() => {
    if (isPlaying && !isTyping && currentLine < totalLines - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentLine(l => l + 1)
        setIsTyping(true)
      }, speed)
    } else if (currentLine >= totalLines - 1 && !isTyping) {
      setIsPlaying(false)
    }
    return () => clearTimeout(intervalRef.current)
  }, [isPlaying, isTyping, currentLine, totalLines, speed])

  // Auto-scroll code pane - start scrolling after line 10, keeping context above
  useEffect(() => {
    if (currentLine < 0 || !codeContainerRef.current) return

    const container = codeContainerRef.current
    const lineHeight = 24 // approximate line height in pixels
    const scrollThreshold = 10 // Start scrolling after this many lines

    // After line 10, gently scroll to keep ~4 lines of context above current line
    if (currentLine >= scrollThreshold) {
      const targetScrollTop = (currentLine - 4) * lineHeight
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      })
    }
  }, [currentLine])

  // Handle divider dragging
  const handleDividerMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = (x / rect.width) * 100
      // Clamp between 20% and 80%
      setDividerPercent(Math.min(80, Math.max(20, percent)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handlePlay = () => {
    if (currentLine >= totalLines - 1) {
      // Reset and play from beginning
      setCurrentLine(-1)
      setCharIndex(0)
      setTimeout(() => {
        setCurrentLine(0)
        setIsTyping(true)
        setIsPlaying(true)
      }, 100)
    } else if (currentLine < 0) {
      setCurrentLine(0)
      setIsTyping(true)
      setIsPlaying(true)
    } else {
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleStepForward = () => {
    setIsPlaying(false)
    // If currently typing, finish the current line first
    if (isTyping) {
      setIsTyping(false)
      setCharIndex(0)
      return
    }
    // Handle initial state - start from line 0
    if (currentLine < 0) {
      setCharIndex(0)
      setCurrentLine(0)
      setIsTyping(true)
      return
    }
    // Move to next line and start typing animation
    if (currentLine < totalLines - 1) {
      setCharIndex(0)
      setCurrentLine(l => l + 1)
      setIsTyping(true) // Enable typing effect!
    }
  }

  const handleStepBackward = () => {
    setIsPlaying(false)
    setIsTyping(false)
    setCharIndex(0)
    if (currentLine > 0) {
      setCurrentLine(l => l - 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setIsTyping(false)
    setCurrentLine(-1)
    setCharIndex(0)
  }

  const handleSkipToEnd = () => {
    setIsPlaying(false)
    setIsTyping(false)
    setCharIndex(0)
    setCurrentLine(totalLines - 1)
  }

  const handleRunCode = async () => {
    if (!hasCompletedWalkthrough || !kernelReady || isRunning) return
    setIsRunning(true)
    setOutput(null)
    try {
      const result = await onRunCode(section.code)
      setOutput(result)
    } catch (err) {
      setOutput({ error: err.message })
    }
    setIsRunning(false)
  }

  // Render explanation with fade-in effect
  const renderDynamicExplanation = (text) => {
    if (!text) return null
    return (
      <div className="animate-fade-in">
        {text.split('\n\n').map((para, i) => (
          <p
            key={i}
            className="text-dark-muted leading-relaxed my-3 first:mt-0 last:mb-0"
            dangerouslySetInnerHTML={{
              __html: para
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/\*(.+?)\*/g, '<em class="text-gray-300">$1</em>')
                .replace(/`([^`]+)`/g, '<code class="bg-neutral-800 px-1.5 py-0.5 rounded text-accent text-sm font-mono">$1</code>')
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="border-t border-neutral-800">
      {/* Fullscreen recommendation */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-950/30 border-b border-purple-800/30">
        <span className="text-purple-400">⛶</span>
        <span className="text-purple-300 text-xs">
          <strong>Tip:</strong> Use fullscreen mode (F11) for the best experience
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-neutral-800 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Reset"
          >
            ↺
          </button>
          <button
            onClick={handleStepBackward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Previous line"
          >
            ◀
          </button>
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              ▶ Play
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              ⏸ Pause
            </button>
          )}
          <button
            onClick={handleStepForward}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Next line"
          >
            ▶
          </button>
          <button
            onClick={handleSkipToEnd}
            className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-semibold rounded-md transition-colors"
            title="Skip to end"
          >
            ⏭
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-dark-muted text-xs">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-neutral-800 text-white text-xs rounded px-2 py-1 border border-neutral-700"
          >
            <option value={1500}>0.5x</option>
            <option value={800}>1x</option>
            <option value={400}>2x</option>
            <option value={200}>4x</option>
          </select>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-accent font-mono text-sm">
            Line {Math.max(0, currentLine + 1)} / {totalLines}
          </span>
          {/* Run Code button - visible but disabled until walkthrough complete */}
          <button
            onClick={handleRunCode}
            disabled={!hasCompletedWalkthrough || !kernelReady || isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              hasCompletedWalkthrough
                ? kernelReady
                  ? isRunning
                    ? 'bg-yellow-600 text-white cursor-wait'
                    : 'bg-green-600 hover:bg-green-500 text-white cursor-pointer animate-pulse'
                  : 'bg-green-600/50 text-white/70 cursor-not-allowed'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
            title={hasCompletedWalkthrough ? 'Run the code' : 'Complete the walkthrough first'}
          >
            {isRunning ? (
              <>
                <span className="animate-spin">⟳</span>
                Running...
              </>
            ) : (
              <>
                <span>▶</span>
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-side layout with draggable divider */}
      <div
        ref={containerRef}
        className={`flex min-h-[300px] ${isDragging ? 'select-none' : ''}`}
      >
        {/* Left: Code */}
        <div
          ref={codeContainerRef}
          className="bg-[#0d1117] overflow-auto"
          style={{ width: `${dividerPercent}%` }}
        >
          <div className="p-4">
            <div className="text-dark-subtle text-xs font-mono uppercase tracking-wider mb-3">
              Code
            </div>
            <pre className="font-mono text-sm leading-relaxed">
              {lines.map((line, i) => {
                const isVisible = i <= currentLine
                const isCurrent = i === currentLine
                const displayLine = isVisible
                  ? (isCurrent && isTyping ? line.slice(0, charIndex) : line)
                  : ''

                return (
                  <div
                    key={i}
                    className={`${isCurrent ? 'bg-accent/10 -mx-2 px-2 rounded' : ''} ${isVisible ? '' : 'opacity-0'}`}
                  >
                    <span className="text-neutral-600 select-none mr-4 inline-block w-4 text-right">
                      {i + 1}
                    </span>
                    <span
                      className="text-gray-300 whitespace-pre"
                      dangerouslySetInnerHTML={{
                        __html: isVisible ? highlightCode(displayLine) : '&nbsp;'
                      }}
                    />
                    {isCurrent && isTyping && (
                      <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5" />
                    )}
                  </div>
                )
              })}
            </pre>
          </div>
        </div>

        {/* Draggable divider */}
        <div
          onMouseDown={handleDividerMouseDown}
          className={`w-1 bg-neutral-700 hover:bg-accent cursor-col-resize flex-shrink-0 transition-colors ${isDragging ? 'bg-accent' : ''}`}
          title="Drag to resize"
        />

        {/* Right: Explanation */}
        <div
          className="bg-gradient-to-br from-neutral-900/50 to-transparent overflow-auto flex-1"
        >
          <div className="p-4">
            <div className="text-dark-subtle text-xs font-mono uppercase tracking-wider mb-3">
              Explanation
            </div>
            {currentLine < 0 ? (
              <div className="text-dark-muted text-sm italic">
                Press Play to begin the walkthrough...
              </div>
            ) : currentExplanation ? (
              <div key={currentExplanation.lines.join('-')}>
                {renderDynamicExplanation(currentExplanation.text)}
              </div>
            ) : (
              <div className="text-dark-muted text-sm italic">
                (continuing...)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output section - shown after running code */}
      {output && (
        <div className={`p-4 border-t border-neutral-800 ${output?.error ? 'bg-red-950/30' : 'bg-[#0d1117]'}`}>
          <div className={`text-xs font-mono uppercase tracking-wider mb-2 ${output?.error ? 'text-red-400' : 'text-green-400'}`}>
            {output?.error ? 'Error' : 'Output'}
          </div>
          {/* Render chart if present */}
          {!output?.error && <ChartDisplay chartData={parseChartData(output?.text)} />}
          {/* Render text output (stripped of chart data) */}
          {(output?.error || stripChartData(output?.text)) && (
            <pre className={`text-sm font-mono whitespace-pre-wrap ${output?.error ? 'text-red-300' : 'text-gray-300'}`}>
              {output?.error || stripChartData(output?.text) || '(no output)'}
            </pre>
          )}
        </div>
      )}

      {/* Completion message */}
      {hasCompletedWalkthrough && !output && (
        <div className="p-4 border-t border-neutral-800 bg-green-950/20">
          <div className="flex items-center gap-3 text-green-400">
            <span className="text-xl">✓</span>
            <div>
              <div className="font-medium">Walkthrough Complete!</div>
              <div className="text-green-600 text-sm">You can now run the code using the button above.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Direct Binder connection
const connectDirectToBinder = async (mounted, setKernelStatus, setStatusMessage, setKernelReady, kernelRef) => {
  if (!mounted) return

  setKernelStatus('building')
  setStatusMessage('Connecting to Binder...')

  const binderUrl = 'https://mybinder.org/build/gh/binder-examples/requirements/HEAD'

  try {
    const eventSource = new EventSource(binderUrl)

    eventSource.onmessage = async (event) => {
      if (!mounted) {
        eventSource.close()
        return
      }

      try {
        const data = JSON.parse(event.data)

        if (data.phase === 'building') {
          setStatusMessage(data.message || 'Building environment...')
        } else if (data.phase === 'launching') {
          setStatusMessage('Launching kernel...')
          setKernelStatus('launching')
        } else if (data.phase === 'ready') {
          eventSource.close()
          setKernelStatus('connecting')
          setStatusMessage('Connecting to kernel...')

          const serverUrl = data.url
          const token = data.token

          const response = await fetch(`${serverUrl}api/kernels`, {
            method: 'POST',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'python3' }),
          })

          if (!response.ok) {
            throw new Error('Failed to start kernel')
          }

          const kernelInfo = await response.json()

          const wsUrl = serverUrl.replace(/^http/, 'ws') + `api/kernels/${kernelInfo.id}/channels?token=${token}`
          const ws = new WebSocket(wsUrl)

          ws.onopen = () => {
            if (mounted) {
              kernelRef.current = ws
              setKernelStatus('ready')
              setStatusMessage('Kernel ready')
              setKernelReady(true)
            }
          }

          ws.onerror = (err) => {
            console.error('WebSocket error:', err)
            if (mounted) {
              setKernelStatus('error')
              setStatusMessage('WebSocket connection failed')
            }
          }

        } else if (data.phase === 'failed') {
          eventSource.close()
          if (mounted) {
            setKernelStatus('error')
            setStatusMessage(data.message || 'Binder build failed')
          }
        }
      } catch (parseErr) {
        // Ignore parse errors
      }
    }

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err)
      eventSource.close()
      if (mounted) {
        setKernelStatus('error')
        setStatusMessage('Connection to Binder failed. Try refreshing.')
      }
    }

    setTimeout(() => {
      if (mounted && kernelRef.current === null) {
        eventSource.close()
        setKernelStatus('error')
        setStatusMessage('Binder build timed out')
      }
    }, 300000)

  } catch (err) {
    console.error('Direct Binder connection error:', err)
    if (mounted) {
      setKernelStatus('error')
      setStatusMessage(err.message)
    }
  }
}

// Tutorial sections data
const sections = [
  {
    id: 'imports',
    title: 'The JAX Ecosystem',
    description: 'Meet the three libraries that power modern JAX machine learning.',
    hasDynamicMode: true,
    code: `import jax
import jax.numpy as jnp
import equinox as eqx
import optax

print(f"JAX version: {jax.__version__}")
print(f"Equinox version: {eqx.__version__}")
print(f"Optax version: {optax.__version__}")`,
    lineExplanations: [
      {
        lines: [0, 0],
        text: `**JAX** is the foundation of our stack.

It provides automatic differentiation (\`grad\`) and XLA compilation (\`jit\`). You've seen this in the previous tutorial — raw power for transforming mathematical functions.`
      },
      {
        lines: [1, 1],
        text: `**jax.numpy** is JAX's drop-in replacement for NumPy.

We import it as \`jnp\` by convention. Same API you know and love — \`jnp.array\`, \`jnp.sin\`, \`jnp.mean\` — but now your arrays live on GPU/TPU and support autodiff.`
      },
      {
        lines: [2, 2],
        text: `**Equinox** is the neural network library.

It gives you \`eqx.Module\` — a clean way to define layers and models that play nicely with JAX's functional style. Think of it as "PyTorch's nn.Module, but for JAX."`
      },
      {
        lines: [3, 3],
        text: `**Optax** is the optimizer library.

SGD, Adam, learning rate schedules — all the standard training machinery. The name is a portmanteau: "opt" (optimization) + "ax" (JAX).`
      },
      {
        lines: [4, 4],
        text: `A blank line for readability.

Good code breathes. The imports above are the *libraries*, the prints below are *verification*.`
      },
      {
        lines: [5, 7],
        text: `**Verification prints** — always check your versions!

Different JAX versions can have different behaviors. Printing versions at the start of a notebook is good practice for reproducibility.

Together, these three libraries form a complete stack: **JAX** transforms your math, **Equinox** structures your models, **Optax** trains them.`
      },
    ],
    explanation: `Welcome to the JAX ecosystem. Three libraries, each with a clear job:

**JAX** is the foundation — automatic differentiation and XLA compilation. You've seen this in the previous tutorial: \`grad\`, \`vmap\`, \`jit\`. Raw power, but low-level.

**Equinox** is the neural network library. It gives you \`eqx.Module\` — a clean way to define layers and models that play nicely with JAX's functional style. Think of it as "PyTorch's nn.Module, but for JAX."

**Optax** is the optimizer library. SGD, Adam, learning rate schedules — all the standard training machinery. The name is a portmanteau: "opt" (optimization) + "ax" (JAX).

Together, they form a complete stack: JAX transforms your math, Equinox structures your models, Optax trains them. Let's use all three to fit a sine wave.`,
  },
  {
    id: 'hyperparameters',
    title: 'Hyperparameters & Architecture',
    description: 'Configure the experiment: samples, learning rate, network shape.',
    hasDynamicMode: true,
    code: `# Training hyperparameters
n_samples = 200
learning_rate = 0.1
n_epochs = 20000  # More epochs for better convergence

# Network architecture
n_input_neurons = 1
n_hidden_layers = 3
n_hidden_neurons = 10
n_output_neurons = 1

# Build layer sizes list: [1, 10, 10, 1]
layers = [n_input_neurons] + n_hidden_layers * [n_hidden_neurons] + [n_output_neurons]
print(f"Layer sizes: {layers}")
print(f"Total layers: {len(layers) - 1}")`,
    lineExplanations: [
      { lines: [0, 0], text: `**Comment header** — we're defining training hyperparameters first.\n\nGood practice: all tunable values at the top of your script.` },
      { lines: [1, 1], text: `**n_samples = 200** — how many data points to generate.\n\nMore samples = smoother sine wave representation, but slower training.` },
      { lines: [2, 2], text: `**learning_rate = 0.1** — how big of a step to take each iteration.\n\nToo high → unstable training. Too low → slow convergence. 0.1 is aggressive but works here.` },
      { lines: [3, 3], text: `**n_epochs = 20000** — how many times to loop through the data.\n\nEach epoch, the network sees all samples once and updates its weights.` },
      { lines: [4, 5], text: `**Section break** — now we define the network architecture.\n\nSeparating hyperparameters into logical groups improves readability.` },
      { lines: [6, 6], text: `**n_input_neurons = 1** — our input is just \`x\`, a single number.\n\nFor image data, this might be 784 (28×28 pixels). For us, it's 1.` },
      { lines: [7, 7], text: `**n_hidden_layers = 3** — three hidden layers of neurons.\n\nMore layers = more expressive power, but harder to train. 3 is plenty for a sine wave.` },
      { lines: [8, 8], text: `**n_hidden_neurons = 10** — each hidden layer has 10 neurons.\n\nThink of each neuron as learning one "feature" of the input-output relationship.` },
      { lines: [9, 9], text: `**n_output_neurons = 1** — we predict a single value: \`sin(x)\`.\n\nFor classification with 10 classes, this would be 10.` },
      { lines: [10, 11], text: `**Section break** — now we build the layer sizes list.\n\nThis list will be passed to our network constructor.` },
      { lines: [12, 12], text: `**Building the layers list** — clever Python list manipulation!\n\n\`[1] + [10, 10, 10] + [1]\` = \`[1, 10, 10, 10, 1]\`\n\nThe \`*\` operator repeats lists: \`3 * [10]\` = \`[10, 10, 10]\`` },
      { lines: [13, 14], text: `**Verification prints** — always check your architecture!\n\nLayer sizes \`[1, 10, 10, 10, 1]\` means: 1→10→10→10→1\n\nTotal layers = 4 (connections between 5 groups of neurons)` },
    ],
    explanation: `Before building anything, we define our experimental setup. This separation of concerns — hyperparameters at the top, model definition below — is good practice. When you want to tune the model later, everything adjustable lives in one place.

**The architecture**: A simple MLP (Multi-Layer Perceptron) with one input neuron (x), three hidden layers of 10 neurons each, and one output neuron (predicted y). The list \`[1, 10, 10, 10, 1]\` encodes this structure.

Notice the clever Python: \`n_hidden_layers * [n_hidden_neurons]\` creates \`[10, 10, 10]\`. List multiplication repeats the list. Then we concatenate: input + hidden + output.

**Why 20,000 epochs?** The original notebook used 100,000, but that takes a while in Binder. 20,000 epochs gives excellent convergence for this deeper network while keeping training time reasonable.`,
  },
  {
    id: 'data',
    title: 'Generate Toy Data',
    description: 'Create the sine wave we\'ll learn to fit.',
    hasDynamicMode: true,
    code: `import json

# Generate x values from 0 to 2π
x_samples = jnp.linspace(0, 2 * jnp.pi, n_samples)
print(f"x shape before reshape: {x_samples.shape}")

# Reshape to column vector (n_samples, 1)
x_samples = x_samples.reshape(-1, 1)
print(f"x shape after reshape: {x_samples.shape}")

# Generate sine wave
y_samples = jnp.sin(x_samples)
print(f"y shape: {y_samples.shape}")

# Visualize the data
chart_data = {
    "type": "scatter",
    "data": [{"x": float(x_samples[i, 0]), "y": float(y_samples[i, 0])} for i in range(0, n_samples, 4)],
    "config": {"title": "Toy Data: sin(x)", "xlabel": "x", "ylabel": "y"}
}
print(f"<<<CHART_DATA>>>{json.dumps(chart_data)}<<</CHART_DATA>>>")`,
    lineExplanations: [
      { lines: [0, 0], text: `**import json** — we need this to serialize chart data.\n\nThe visualization system uses JSON to pass data from Python to JavaScript.` },
      { lines: [1, 2], text: `**Comment** — we're generating x values for our sine wave.\n\nThe domain is 0 to 2π (one complete sine cycle).` },
      { lines: [3, 3], text: `**jnp.linspace** — creates 200 evenly spaced points from 0 to 2π.\n\nThink of it as: "give me n_samples points between start and end."` },
      { lines: [4, 4], text: `**Print the shape** — sanity check! Should be \`(200,)\`.\n\nThis is a 1D array. Neural networks need 2D arrays (batch × features).` },
      { lines: [5, 6], text: `**Comment** — the reshape is coming.\n\nThis is a crucial step that trips up many beginners.` },
      { lines: [7, 7], text: `**reshape(-1, 1)** — convert from 1D to 2D column vector.\n\n\`-1\` means "figure out this dimension automatically."\n\nResult: shape goes from \`(200,)\` to \`(200, 1)\` — 200 samples, 1 feature each.` },
      { lines: [8, 8], text: `**Verify the reshape** — should now be \`(200, 1)\`.\n\nThis shape says: "200 samples, each with 1 input feature."` },
      { lines: [9, 10], text: `**Comment** — now we compute the target values.\n\nOur network will learn to predict these y values from the x values.` },
      { lines: [11, 11], text: `**y_samples = jnp.sin(x_samples)** — the ground truth!\n\nThis is what we want our neural network to learn to approximate.` },
      { lines: [12, 12], text: `**Verify y shape** — should match x: \`(200, 1)\`.\n\nEach x value maps to exactly one y value.` },
      { lines: [13, 14], text: `**Comment** — let's visualize what we just created.\n\nSeeing your data is always a good idea before training.` },
      { lines: [15, 19], text: `**Build chart data** — we're creating a scatter plot specification.\n\nThe data is subsampled (every 4th point) for cleaner visualization.\n\nWe convert JAX arrays to Python floats for JSON serialization.` },
      { lines: [20, 20], text: `**Output the chart** — special markers tell the UI to render this as a chart.\n\nThe \`<<<CHART_DATA>>>\` tags are parsed by our React component.` },
    ],
    explanation: `We're creating the simplest possible regression problem: learn to predict \`sin(x)\` from \`x\`.

**The reshape is crucial.** \`jnp.linspace\` returns a 1D array of shape \`(200,)\`. But neural networks expect batched inputs — each sample should be a row, each feature a column. Reshaping to \`(200, 1)\` says "200 samples, 1 feature each."

**Why \`reshape(-1, 1)\`?** The \`-1\` is a wildcard: "figure out this dimension based on the total size." It's equivalent to \`reshape(200, 1)\` but more flexible — if you change \`n_samples\`, the code still works.

This pattern — generating synthetic data to test your model — is invaluable during development. If your network can't fit a sine wave, something is fundamentally broken. Fix that before trying real data.`,
  },
  {
    id: 'mlp-class',
    title: 'Define the MLP Class',
    description: 'Build a neural network using Equinox modules.',
    hasDynamicMode: true,
    code: `import jax
import jax.numpy as jnp
import equinox as eqx

class MLP(eqx.Module):
    layers: list

    def __init__(self, key):
        keys = jax.random.split(key, 4)
        self.layers = [
            eqx.nn.Linear(1, 10, key=keys[0]),
            eqx.nn.Linear(10, 10, key=keys[1]),
            eqx.nn.Linear(10, 10, key=keys[2]),
            eqx.nn.Linear(10, 1, key=keys[3]),
        ]

    def __call__(self, x):
        x = jax.nn.sigmoid(self.layers[0](x))
        x = jax.nn.sigmoid(self.layers[1](x))
        x = jax.nn.sigmoid(self.layers[2](x))
        return self.layers[-1](x)

# Architecture: 1 → 10 → 10 → 10 → 1
model = MLP(jax.random.PRNGKey(42))
print(f"Model created! {len(model.layers)} layers")`,
    lineExplanations: [
      { lines: [0, 2], text: `**Imports** — the JAX ecosystem.\n\n\`jax\` for autodiff and transforms.\n\`jax.numpy\` for array operations.\n\`equinox\` for neural network modules.` },
      { lines: [3, 4], text: `**class MLP(eqx.Module)** — our neural network!\n\n\`eqx.Module\` is Equinox's base class — like PyTorch's \`nn.Module\` but immutable and JAX-native.` },
      { lines: [5, 5], text: `**layers: list** — tells Equinox this holds learnable parameters.\n\nWithout this annotation, gradients wouldn't flow through!` },
      { lines: [6, 7], text: `**\\_\\_init\\_\\_** — the constructor.\n\n\`key\` is JAX's random seed for weight initialization.` },
      { lines: [8, 8], text: `**Split the key** — one for each layer.\n\n4 layers need 4 independent random keys.\n\nThis ensures reproducible initialization.` },
      { lines: [9, 14], text: `**Create all 4 layers explicitly** — this matches our architecture!\n\n• Layer 0: 1 → 10 (input to first hidden)\n• Layer 1: 10 → 10 (hidden to hidden)\n• Layer 2: 10 → 10 (hidden to hidden)\n• Layer 3: 10 → 1 (hidden to output)` },
      { lines: [15, 16], text: `**\\_\\_call\\_\\_** — the forward pass.\n\nThis runs when you do \`model(x)\`.` },
      { lines: [17, 17], text: `**First hidden layer** — apply layer 0, then sigmoid.\n\nInput x (size 1) → 10 neurons → squash to (0,1).` },
      { lines: [18, 18], text: `**Second hidden layer** — apply layer 1, then sigmoid.\n\n10 neurons → 10 neurons → squash to (0,1).` },
      { lines: [19, 19], text: `**Third hidden layer** — apply layer 2, then sigmoid.\n\n10 neurons → 10 neurons → squash to (0,1).` },
      { lines: [20, 20], text: `**Output layer — NO activation!**\n\nFor regression, we want raw unbounded values.\n\n10 neurons → 1 output.` },
      { lines: [21, 22], text: `**Architecture comment** — documents the network shape.\n\n1 input → 10 → 10 → 10 → 1 output.` },
      { lines: [23, 24], text: `**Instantiate the model!**\n\n\`PRNGKey(42)\` seeds randomness — same seed = same initial weights = reproducible results.` },
    ],
    explanation: `This code defines our neural network — a Multi-Layer Perceptron (MLP) with architecture [1, 10, 10, 10, 1]. That's 1 input, three hidden layers of 10 neurons each, and 1 output. The code matches exactly what the interactive sim above generates!

**\`eqx.Module\`** is Equinox's base class for neural networks. Unlike PyTorch where you modify weights in-place, Equinox modules are *immutable* — training creates new models with updated weights. This plays nicely with JAX's functional style.

**The 4 Linear layers** are created explicitly. Each \`eqx.nn.Linear(in, out, key)\` creates a weight matrix of shape \`(out, in)\` and a bias vector of shape \`(out,)\`. The random key ensures reproducible initialization.

**The forward pass** applies sigmoid activation after each hidden layer. Sigmoid squashes values to (0, 1) — smooth, differentiable, and historically significant. The final layer has NO activation — for regression we want unbounded outputs.

Try modifying the architecture in the sim above and see how the code changes!`,
  },
  {
    id: 'init-model',
    title: 'First Prediction',
    description: 'See what random weights produce — and learn about vmap.',
    hasDynamicMode: true,
    code: `# Model was created in the previous section
# Let's try to make a prediction...
# This will fail! Let's see why.
try:
    bad_pred = model(x_samples)
except Exception as e:
    print(f"Error: {type(e).__name__}")
    print(f"The model expects single samples, not batches!")

# The fix: use vmap to handle batches
initial_pred = jax.vmap(model)(x_samples)
print(f"\\nWith vmap - prediction shape: {initial_pred.shape}")

# Visualize: random weights = garbage predictions
chart_data = {
    "type": "scatter_line",
    "data": [{"x": float(x_samples[i, 0]), "actual": float(y_samples[i, 0]), "predicted": float(initial_pred[i, 0])} for i in range(0, n_samples, 4)],
    "config": {"title": "Initial Prediction (Random Weights)", "scatter_name": "Actual (sin x)", "line_name": "Predicted (garbage)"}
}
print(f"<<<CHART_DATA>>>{json.dumps(chart_data)}<<</CHART_DATA>>>")`,
    lineExplanations: [
      { lines: [0, 2], text: `**Let's try a prediction** — but this will fail!\n\nWe're about to learn an important JAX lesson about batching.` },
      { lines: [3, 4], text: `**try/except block** — we expect an error here.\n\n\`model(x_samples)\` passes ALL 200 samples at once.` },
      { lines: [5, 7], text: `**Catch the error** — our model expects single samples!\n\nThe Linear layer got shape \`(200, 1)\` but expected \`(1,)\`.\n\nThis is a classic JAX gotcha.` },
      { lines: [8, 9], text: `**The solution: vmap!** — vectorized map.\n\n\`jax.vmap(model)\` transforms our single-sample function into a batch function.\n\nIt's like an implicit loop, but parallelized on GPU.` },
      { lines: [10, 11], text: `**Now it works!** — vmap handles the batching.\n\nShape should be \`(200, 1)\` — one prediction per sample.\n\nThe predictions are garbage (random weights), but the shapes are correct!` },
      { lines: [12, 13], text: `**Let's visualize** — see how bad random weights are.\n\nWe'll plot actual sine wave vs. the network's initial guesses.` },
      { lines: [14, 18], text: `**Build scatter_line chart** — overlay prediction on ground truth.\n\nYellow dots = actual sin(x)\nRed line = network prediction (currently garbage)\n\nAfter training, these should align!` },
      { lines: [19, 19], text: `**Output the visualization** — you'll see how far off we start.\n\nThe network has no idea what a sine wave is... yet.` },
    ],
    explanation: `Here's a classic JAX gotcha that trips up everyone.

Our model's \`__call__\` expects a *single* input — one \`(1,)\` vector. But we're passing *all 200 samples* at once as a \`(200, 1)\` array. The linear layer tries to do matrix multiplication with incompatible shapes, and everything explodes.

**The solution: \`jax.vmap\`**. This transforms a function that operates on single inputs into one that operates on batches. \`jax.vmap(model)\` creates a "vectorized model" that processes all samples in parallel.

This is the JAX way. Instead of writing batch-aware code inside your model (like PyTorch often requires), you write clean single-sample logic and let \`vmap\` handle batching. Separation of concerns: your model does math, \`vmap\` does parallelization.

The initial predictions are garbage — random weights produce random outputs. But the shapes are right, which is what matters. Now let's train.`,
  },
  {
    id: 'loss',
    title: 'The Loss Function',
    description: 'Mean Squared Error — the classic regression objective.',
    hasDynamicMode: true,
    code: `def mse_loss(model, x, y):
    predictions = jax.vmap(model)(x)
    residuals = y - predictions
    return jnp.mean(jnp.square(residuals))

# Compute initial loss
initial_loss = mse_loss(model, x_samples, y_samples)
print(f"Initial loss: {initial_loss:.4f}")

# What does this number mean?
avg_error = jnp.sqrt(initial_loss)
print(f"Average prediction error: {avg_error:.4f}")
print(f"(Sine wave ranges from -1 to 1)")`,
    lineExplanations: [
      { lines: [0, 0], text: `**Define the loss function** — this measures how wrong we are.\n\n\`model\` is the first argument — crucial! We'll differentiate w.r.t. this.\n\n\`x\` and \`y\` are our data.` },
      { lines: [1, 1], text: `**Get predictions** — run the model on all inputs.\n\n\`jax.vmap(model)(x)\` handles batching automatically.\n\nResult shape: \`(200, 1)\` — one prediction per sample.` },
      { lines: [2, 2], text: `**Compute residuals** — how far off is each prediction?\n\n\`residuals = truth - prediction\`\n\nPositive = undershot, Negative = overshot.` },
      { lines: [3, 3], text: `**Mean Squared Error** — the classic regression loss.\n\n1. Square each residual (makes all positive, penalizes big errors)\n2. Take the mean (single number summarizing total error)\n\nLower MSE = better model!` },
      { lines: [4, 6], text: `**Compute initial loss** — how bad is our random model?\n\nThis gives us a baseline. After training, loss should be much lower.` },
      { lines: [7, 8], text: `**Interpret the loss** — what does this number mean?\n\n\`sqrt(MSE)\` ≈ average error in original units (y values).` },
      { lines: [9, 11], text: `**Context for the error** — sine ranges from -1 to 1.\n\nIf average error is ~0.5, predictions are off by about 25% of the range.\n\nThat's bad! But expected from random weights.` },
    ],
    explanation: `Mean Squared Error (MSE) is the workhorse of regression. The formula is beautifully simple: for each sample, compute \`(prediction - truth)²\`, then average across all samples.

**Why squared?** Two reasons. First, it makes all errors positive — undershooting and overshooting both contribute. Second, it penalizes large errors more than small ones. A prediction that's off by 2 contributes 4 to the loss, not 2.

**The square root trick**: \`sqrt(MSE)\` gives you the average error in the original units. If MSE is 0.25, the average prediction is off by 0.5. Since sine waves range from -1 to 1, that's pretty bad — but expected from random weights.

Notice that the loss function takes \`model\` as its first argument. This is intentional — we'll need to differentiate *with respect to the model's parameters*. In JAX/Equinox, this means the model itself must be an argument.`,
  },
  {
    id: 'gradients',
    title: 'Computing Gradients',
    description: 'Equinox\'s filter_value_and_grad for selective differentiation.',
    hasDynamicMode: true,
    code: `# Create a function that returns both loss AND gradients
loss_and_grad = eqx.filter_value_and_grad(mse_loss)

# Use it
loss_val, grads = loss_and_grad(model, x_samples, y_samples)
print(f"Loss: {loss_val:.4f}")
print(f"Gradients type: {type(grads)}")
print(f"Gradients structure matches model: {type(grads) == type(model)}")

# Peek at one gradient
print(f"\\nFirst layer weight gradient shape: {grads.layers[0].weight.shape}")`,
    lineExplanations: [
      { lines: [0, 1], text: `**filter_value_and_grad** — Equinox's gradient magic!\n\nThis wraps our loss function to return BOTH:\n- The loss value (for monitoring)\n- Gradients w.r.t. model parameters (for updating)\n\nThe "filter" part automatically finds learnable parameters.` },
      { lines: [2, 4], text: `**Call it!** — returns (loss, gradients) tuple.\n\nGradients tell us: "which direction should each weight move to reduce loss?"` },
      { lines: [5, 5], text: `**Print the loss** — should match what we computed before.\n\nGood sanity check that wrapping didn't change anything.` },
      { lines: [6, 7], text: `**Gradient structure** — here's the magic.\n\n\`grads\` is a \`MLP\` object — same structure as \`model\`!\n\nWhere model has weights, grads has *gradients of loss w.r.t. those weights*.` },
      { lines: [8, 10], text: `**Peek inside** — gradients have matching shapes.\n\nFirst layer: 10 neurons, 1 input → weight shape \`(10, 1)\`\n\nGradient shape is also \`(10, 1)\` — one gradient per weight.\n\nThese tell us exactly how to update each weight!` },
    ],
    explanation: `Here's where Equinox earns its keep.

In vanilla JAX, \`jax.value_and_grad\` computes gradients with respect to the *first argument*. But our model is a complex object with parameters nested inside layers. How does JAX know *which* parts to differentiate?

**\`eqx.filter_value_and_grad\`** handles this automatically. By default, it differentiates with respect to all "inexact arrays" — floating-point arrays that represent learnable parameters. Integer arrays, Python objects, non-numeric attributes are ignored.

The result is elegant: \`grads\` has the *exact same structure* as \`model\`. It's a \`MLP\` object where \`.layers[0].weight\` contains the gradients for the first layer's weights, \`.layers[0].bias\` contains bias gradients, and so on.

This structural matching is crucial for the next step: using an optimizer to update the weights.`,
  },
  {
    id: 'optimizer',
    title: 'Setting Up the Optimizer',
    description: 'Optax brings battle-tested optimizers to JAX.',
    hasDynamicMode: true,
    code: `# Create SGD optimizer with our learning rate
optimizer = optax.sgd(learning_rate)

# Initialize optimizer state
# (tracks momentum, etc. - SGD doesn't need much, but Adam would)
opt_state = optimizer.init(eqx.filter(model, eqx.is_array))

print(f"Optimizer: SGD with lr={learning_rate}")
print(f"Optimizer state type: {type(opt_state)}")`,
    lineExplanations: [
      { lines: [0, 1], text: `**Create the optimizer** — SGD (Stochastic Gradient Descent).\n\n\`learning_rate = 0.1\` controls step size.\n\nSGD is simple: \`new_weight = old_weight - lr * gradient\`` },
      { lines: [2, 4], text: `**Initialize optimizer state** — what the optimizer "remembers."\n\nFor SGD: basically nothing.\nFor Adam: moving averages of gradients (momentum).` },
      { lines: [5, 5], text: `**eqx.filter** — extract only array parameters.\n\nThe optimizer needs to track state for each learnable parameter.\n\n\`eqx.is_array\` filters to just the JAX arrays (weights & biases).` },
      { lines: [6, 8], text: `**Verification** — print what we've set up.\n\nThe optimizer is ready to update weights!\n\nNext: combine everything into a training step.` },
    ],
    explanation: `Optax separates the optimizer *definition* from its *state*.

**\`optax.sgd(learning_rate)\`** creates an optimizer configuration. It's a recipe, not a live optimizer. This recipe says: "When given gradients, scale them by the learning rate and subtract from parameters."

**\`optimizer.init()\`** creates the optimizer *state* — a data structure that tracks any information the optimizer needs across steps. For vanilla SGD, this is minimal (basically empty). For Adam, it would track the moving averages of gradients and squared gradients.

**The \`eqx.filter\`**: We filter the model to extract only arrays (the parameters). The optimizer state needs to match the shape of what it's optimizing. We don't want it trying to "optimize" non-numeric attributes.

This separation of config and state is very JAX: everything is explicit, nothing is hidden in mutable object internals. You can serialize optimizer states, run multiple parallel optimizations, restart from checkpoints — all straightforward.`,
  },
  {
    id: 'make-step',
    title: 'The Training Step',
    description: 'Combine gradients + optimizer into one JIT-compiled function.',
    hasDynamicMode: true,
    code: `@eqx.filter_jit
def make_step(model, opt_state, x, y):
    # Compute loss and gradients
    loss, grads = loss_and_grad(model, x, y)

    # Ask optimizer for updates
    updates, opt_state = optimizer.update(grads, opt_state, model)

    # Apply updates to model
    model = eqx.apply_updates(model, updates)

    return model, opt_state, loss

# Test one step
model_after_one_step, opt_state, loss = make_step(model, opt_state, x_samples, y_samples)
print(f"Loss after 1 step: {loss:.4f}")

# Run a few more
for i in range(4):
    model_after_one_step, opt_state, loss = make_step(model_after_one_step, opt_state, x_samples, y_samples)
print(f"Loss after 5 steps: {loss:.4f}")`,
    lineExplanations: [
      { lines: [0, 1], text: `**@eqx.filter_jit** — JIT-compile for SPEED!\n\nFirst call: JAX traces the function and compiles it.\nSubsequent calls: blazingly fast compiled code.\n\nThe "filter" handles non-JIT-able parts (like Python lists).` },
      { lines: [2, 3], text: `**Step 1: Compute gradients** — how should weights change?\n\n\`loss_and_grad\` returns both the loss value and gradients.` },
      { lines: [4, 6], text: `**Step 2: Get updates from optimizer** — process gradients.\n\n\`optimizer.update()\` converts gradients into weight updates.\n\nFor SGD: \`updates = -learning_rate * grads\`\n\nAlso returns new optimizer state (for Adam's momentum, etc.)` },
      { lines: [7, 9], text: `**Step 3: Apply updates** — create new model with updated weights.\n\nEquinox models are immutable — we don't modify in-place.\n\n\`eqx.apply_updates\` returns a NEW model with updated parameters.` },
      { lines: [10, 11], text: `**Return everything** — the training loop needs all of this.\n\n- Updated model (for next iteration)\n- Updated optimizer state (for momentum)\n- Loss (for monitoring progress)` },
      { lines: [12, 14], text: `**Test it!** — run one training step.\n\nLoss should decrease (at least a little) from the initial value.` },
      { lines: [15, 18], text: `**Run a few more** — watch the loss drop!\n\nEach step, the model gets slightly better at predicting sin(x).\n\nAfter 5 steps, loss should be noticeably lower.` },
      { lines: [19, 19], text: `**Progress report** — loss after 5 steps.\n\nStill high, but trending down. The network is learning!\n\nNext: scale this up to 20,000 steps.` },
    ],
    explanation: `This is the core of training, wrapped in one clean function.

**The workflow**: Compute gradients → optimizer processes them into updates → apply updates to model. Three lines of actual logic.

**\`optimizer.update()\`** takes gradients and returns *updates* — what to add to each parameter. For SGD, updates are just \`-learning_rate * gradients\`. For Adam, there's momentum and adaptive learning rates involved. You don't need to care — Optax handles it.

**\`eqx.apply_updates()\`** creates a *new* model with updated parameters. Remember, Equinox modules are immutable. We're not modifying \`model\`; we're creating \`new_model\` with adjusted weights.

**\`@eqx.filter_jit\`**: This decorator JIT-compiles the function for speed. The "filter" part handles the fact that our model contains non-JIT-able things (like Python lists of layers). Equinox filters those out, JITs the numeric parts, and reassembles.

Watch the loss drop as we step. The network is learning!`,
  },
  {
    id: 'training-loop',
    title: 'The Training Loop',
    description: 'Watch the neural network learn in real-time!',
    hasDynamicMode: true,
    code: `# Reset model and optimizer for clean training
model = MLP(jax.random.PRNGKey(42))
opt_state = optimizer.init(eqx.filter(model, eqx.is_array))

# Training loop with checkpoints for animation
loss_history = []
checkpoints = []
checkpoint_every = 50  # Save predictions every N epochs (more granularity)
loss_sample_every = 10  # Sample loss every N epochs
x_plot = x_samples[::4]  # Subsample for visualization (50 points)

print("Training... (collecting animation data)")

for epoch in range(n_epochs):
    model, opt_state, loss = make_step(model, opt_state, x_samples, y_samples)
    loss_history.append(float(loss))

    # Save checkpoint for animation
    if epoch % checkpoint_every == 0:
        preds = jax.vmap(model)(x_plot)
        checkpoints.append({
            "epoch": epoch,
            "loss": float(loss),
            "predictions": [float(p[0]) for p in preds]
        })
        if epoch % 1000 == 0:
            print(f"Epoch {epoch:5d} | Loss: {loss:.6f}")

# Final checkpoint
preds = jax.vmap(model)(x_plot)
checkpoints.append({
    "epoch": n_epochs,
    "loss": float(loss_history[-1]),
    "predictions": [float(p[0]) for p in preds]
})

print(f"\\nTraining complete! Final loss: {loss_history[-1]:.6f}")
print(f"Collected {len(checkpoints)} animation frames")

# Output animated training visualization
ground_truth = [{"x": float(x_plot[i, 0]), "y": float(jnp.sin(x_plot[i, 0]))} for i in range(len(x_plot))]
chart_data = {
    "type": "animated_training",
    "data": {
        "checkpoints": checkpoints,
        "loss_history": loss_history[::loss_sample_every],
        "ground_truth": ground_truth,
        "epochs_per_loss_sample": loss_sample_every
    },
    "config": {"title": "Watch the Neural Network Learn!"}
}
print(f"<<<CHART_DATA>>>{json.dumps(chart_data)}<<</CHART_DATA>>>")`,
    lineExplanations: [
      { lines: [0, 2], text: `**Fresh start** — reset model and optimizer.\n\nWe tested with 5 steps earlier, which modified the model.\n\nNow we start clean for the full 20,000 epoch run.` },
      { lines: [3, 5], text: `**Animation data structures** — we'll record the learning process.\n\n\`loss_history\` — loss at every epoch (for plotting)\n\`checkpoints\` — snapshots of predictions (for animation)` },
      { lines: [6, 8], text: `**Animation settings** — how often to save snapshots.\n\n\`checkpoint_every = 50\` — save predictions every 50 epochs (400 frames total)\n\n\`loss_sample_every = 10\` — subsample loss for plotting` },
      { lines: [9, 10], text: `**Status message** — let the user know we're starting.\n\nTraining 20,000 epochs takes a few seconds.` },
      { lines: [11, 14], text: `**THE TRAINING LOOP** — the heart of machine learning!\n\n\`for epoch in range(20000)\` — repeat 20,000 times:\n1. Take one gradient step\n2. Record the loss\n\nEach iteration, the model gets slightly better.` },
      { lines: [15, 16], text: `**Save checkpoint for animation** — every 50 epochs.\n\nWe snapshot the model's current predictions.` },
      { lines: [17, 23], text: `**Build checkpoint data** — store epoch, loss, and predictions.\n\nThese snapshots will animate in the visualization.\n\nAlso print progress every 1000 epochs so you know it's working.` },
      { lines: [24, 30], text: `**Final checkpoint** — capture the fully trained model.\n\nThe last snapshot shows the converged predictions.` },
      { lines: [31, 33], text: `**Training complete!** — report final loss.\n\nShould be ~0.001 or lower — nearly perfect sine approximation!` },
      { lines: [34, 35], text: `**Build ground truth** — the actual sine wave for comparison.\n\nThis will be the yellow dots in the visualization.` },
      { lines: [36, 46], text: `**Build animation data** — everything needed for the viz.\n\n- \`checkpoints\` — model predictions over time\n- \`loss_history\` — loss curve data\n- \`ground_truth\` — target sine wave\n\nThe animation shows both loss dropping AND predictions improving!` },
      { lines: [47, 47], text: `**Output the visualization** — watch the magic!\n\n**Left panel**: Loss curve building up over epochs.\n**Right panel**: Red line converging to yellow dots.\n\nPress Play and watch gradient descent in action!` },
    ],
    explanation: `**Press Play and watch the magic happen!**

On the left, you see the loss curve building up as training progresses. On the right, watch the red line (neural network predictions) slowly converge to match the yellow dots (ground truth sine wave).

The training loop itself is deceptively simple: call \`make_step\` 5000 times. That's it. But we're also saving "checkpoints" — snapshots of the model's predictions at regular intervals — so you can visualize the learning process.

**What you're watching**: At epoch 0, the network outputs garbage (random weights). By epoch 500, it's starting to capture the general shape. By epoch 2000+, it's nearly perfect. This is gradient descent in action — each step nudges the weights slightly to reduce the error.

**The speedup**: The first iteration is slow — JAX is tracing and compiling the function. Every subsequent iteration is fast because we JIT-compiled \`make_step\`. 5000 steps complete in seconds.

Watch the loss drop from ~0.5 to ~0.001 or lower. The network is learning to sine!`,
  },
  {
    id: 'results',
    title: 'Visualize Results',
    description: 'See what the trained network learned.',
    hasDynamicMode: true,
    code: `# Generate predictions from trained model
final_pred = jax.vmap(model)(x_samples)

# Summary stats
errors = jnp.abs(y_samples - final_pred)
print(f"Max error: {float(jnp.max(errors)):.4f}")
print(f"Mean error: {float(jnp.mean(errors)):.4f}")
print(f"The network learned to approximate sin(x)!")

# Beautiful visualization: actual vs predicted
chart_data = {
    "type": "scatter_line",
    "data": [{"x": float(x_samples[i, 0]), "actual": float(y_samples[i, 0]), "predicted": float(final_pred[i, 0])} for i in range(0, n_samples, 2)],
    "config": {"title": "Final Result: Network vs sin(x)", "scatter_name": "Actual sin(x)", "line_name": "Neural Network"}
}
print(f"<<<CHART_DATA>>>{json.dumps(chart_data)}<<</CHART_DATA>>>")`,
    lineExplanations: [
      { lines: [0, 1], text: `**Generate final predictions** — how well did we do?\n\n\`model\` now contains trained weights.\n\n\`jax.vmap(model)(x_samples)\` runs the trained network on all inputs.` },
      { lines: [2, 4], text: `**Compute errors** — absolute difference between prediction and truth.\n\n\`errors = |y_actual - y_predicted|\`\n\nThis tells us how far off each prediction is.` },
      { lines: [5, 7], text: `**Error statistics** — summarize performance.\n\n**Max error**: worst-case prediction (should be < 0.05)\n**Mean error**: average mistake (should be < 0.01)\n\nThe network learned sin(x)!` },
      { lines: [8, 9], text: `**Time for the final visualization** — the payoff!\n\nLet's see the trained network vs. ground truth.` },
      { lines: [10, 14], text: `**Build the chart** — overlay prediction on actual sine wave.\n\n**Yellow dots**: actual sin(x) values\n**Red line**: neural network predictions\n\nIf training worked, they should overlap almost perfectly!` },
      { lines: [15, 15], text: `**The moment of truth!** — see your trained network.\n\n**You did it!** From random noise to sine wave approximation.\n\nThis same pattern — define model, define loss, optimize — scales to any problem.\n\nCongratulations, you just trained a neural network in JAX!` },
    ],
    explanation: `The moment of truth: does our network actually approximate a sine wave?

Look at that chart. The yellow dots are the true sine wave. The red line is what our neural network predicts. They're nearly indistinguishable.

The predictions should be very close to the actual values. Errors in the 0.001-0.01 range mean the network has effectively memorized the training data — which is exactly what we wanted for this toy problem.

**What did the network learn?** Inside those 2 hidden layers with 10 neurons each are weights that, when combined with sigmoid activations, produce something very close to \`sin(x)\`. It's not computing sine analytically — it's approximating it with a series of weighted sigmoids. Universal function approximation in action.

You just trained a neural network in JAX. From random weights to sine-wave predictor, using Equinox for structure and Optax for optimization. This same pattern scales to much larger problems.`,
  },
]

function CollapsibleSection({ section, index, isOpen, onToggle, kernelReady, onRunCode }) {
  const [code, setCode] = useState(section.code)
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [viewMode, setViewMode] = useState('static') // 'static' or 'dynamic'

  const isModified = code !== section.code
  const hasDynamicMode = section.hasDynamicMode && section.lineExplanations

  const handleRun = async () => {
    if (!kernelReady) return
    setIsRunning(true)
    setOutput(null)
    try {
      const result = await onRunCode(code)
      setOutput(result)
    } catch (err) {
      setOutput({ error: err.message })
    }
    setIsRunning(false)
  }

  const handleRestore = () => {
    setCode(section.code)
    setOutput(null)
  }

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mb-4 w-[calc(100vw-2rem)] ml-[calc(-50vw+50%+1rem)]">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-accent font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="text-white font-semibold">{section.title}</h3>
            <p className="text-dark-muted text-sm mt-0.5">{section.description}</p>
          </div>
        </div>
        <span className="text-dark-muted text-xl font-light ml-4">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-neutral-800">
          {/* Mode toggle for sections with dynamic mode */}
          {hasDynamicMode && (
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900/50 border-b border-neutral-800">
              <span className="text-dark-muted text-xs mr-2">View:</span>
              <button
                onClick={() => setViewMode('static')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'static'
                    ? 'bg-accent text-black'
                    : 'bg-neutral-800 text-dark-muted hover:text-white'
                }`}
              >
                Static
              </button>
              <button
                onClick={() => setViewMode('dynamic')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'dynamic'
                    ? 'bg-accent text-black'
                    : 'bg-neutral-800 text-dark-muted hover:text-white'
                }`}
              >
                Dynamic
              </button>
            </div>
          )}

          {/* Dynamic mode view */}
          {hasDynamicMode && viewMode === 'dynamic' ? (
            <DynamicCodeSection section={section} onRunCode={onRunCode} kernelReady={kernelReady} />
          ) : (
          <>
          {/* Code editor */}
          <div className="relative">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-dark-subtle text-xs font-mono uppercase tracking-wider">
                  Python
                </span>
                {isModified && (
                  <span className="text-yellow-500 text-xs">(modified)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isModified && (
                  <button
                    onClick={handleRestore}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-dark-muted hover:text-white hover:bg-neutral-700 transition-colors"
                  >
                    ↺ Restore
                  </button>
                )}
                <button
                  onClick={handleRun}
                  disabled={!kernelReady || isRunning}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    kernelReady
                      ? isRunning
                        ? 'bg-yellow-600 text-white cursor-wait'
                        : 'bg-green-600 hover:bg-green-500 text-white cursor-pointer'
                      : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Running...
                    </>
                  ) : (
                    <>
                      <span>▶</span>
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={highlightCode}
              padding={16}
              className="code-editor"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                backgroundColor: '#0d1117',
                minHeight: '100px',
              }}
              textareaClassName="code-editor-textarea"
            />
          </div>

          {/* Output */}
          {output && (
            <div className={`p-4 border-t border-neutral-800 ${output?.error ? 'bg-red-950/30' : 'bg-[#0d1117]'}`}>
              <div className={`text-xs font-mono uppercase tracking-wider mb-2 ${output?.error ? 'text-red-400' : 'text-green-400'}`}>
                {output?.error ? 'Error' : 'Output'}
              </div>
              {/* Render chart if present */}
              {!output?.error && <ChartDisplay chartData={parseChartData(output?.text)} />}
              {/* Render text output (stripped of chart data) */}
              {(output?.error || stripChartData(output?.text)) && (
                <pre className={`text-sm font-mono whitespace-pre-wrap ${output?.error ? 'text-red-300' : 'text-gray-300'}`}>
                  {output?.error || stripChartData(output?.text) || '(no output)'}
                </pre>
              )}
            </div>
          )}

          {/* Explanation */}
          {section.explanation && (
            <div className="p-6 border-t border-neutral-800 bg-gradient-to-b from-neutral-900/30 to-transparent">
              <div className="prose-sm max-w-none">
                {renderExplanation(section.explanation)}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      )}
    </div>
  )
}

export default function JaxRegression() {
  const [openSections, setOpenSections] = useState({})
  const [kernelStatus, setKernelStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [kernelReady, setKernelReady] = useState(false)
  const [setupStatus, setSetupStatus] = useState({ install: 'pending', imports: 'pending' })
  const kernelRef = useRef(null)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    setKernelStatus('building')
    setStatusMessage('Connecting to Binder...')
    setKernelReady(false)
    kernelRef.current = null
    connectDirectToBinder(mountedRef.current, setKernelStatus, setStatusMessage, setKernelReady, kernelRef)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => { mountedRef.current = false }
  }, [connect])

  const runCode = useCallback(async (code) => {
    if (!kernelRef.current) {
      throw new Error('Kernel not ready')
    }

    return new Promise((resolve, reject) => {
      const kernel = kernelRef.current
      const msgId = crypto.randomUUID()
      let output = ''
      let done = false

      const msg = {
        header: {
          msg_id: msgId,
          msg_type: 'execute_request',
          username: '',
          session: crypto.randomUUID(),
          version: '5.3',
        },
        parent_header: {},
        metadata: {},
        content: {
          code,
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false,
        },
      }

      const handler = (event) => {
        try {
          const response = JSON.parse(event.data)
          if (response.parent_header?.msg_id !== msgId) return

          if (response.msg_type === 'stream') {
            output += response.content.text
          } else if (response.msg_type === 'execute_result') {
            output += response.content.data['text/plain']
          } else if (response.msg_type === 'error') {
            kernel.removeEventListener('message', handler)
            reject(new Error(response.content.evalue))
            done = true
          } else if (response.msg_type === 'execute_reply') {
            kernel.removeEventListener('message', handler)
            resolve({ text: output || '(executed)' })
            done = true
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      kernel.addEventListener('message', handler)
      kernel.send(JSON.stringify(msg))

      setTimeout(() => {
        if (!done) {
          kernel.removeEventListener('message', handler)
          reject(new Error('Execution timed out'))
        }
      }, 120000) // 2 min timeout for training
    })
  }, [])

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const expandAll = () => {
    const allOpen = {}
    sections.forEach(s => { allOpen[s.id] = true })
    setOpenSections(allOpen)
  }

  const collapseAll = () => {
    setOpenSections({})
  }

  return (
    <Layout>
      {/* Kernel Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            to="/teaching-pinns/tutorials"
            className="inline-flex items-center gap-2 text-dark-muted hover:text-white text-sm transition-colors"
          >
            <span>←</span>
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                kernelStatus === 'ready'
                  ? 'bg-green-500'
                  : kernelStatus === 'error'
                  ? 'bg-red-500'
                  : ['building', 'launching', 'connecting'].includes(kernelStatus)
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-neutral-500'
              }`}
            />
            <span className="text-xs text-dark-muted">
              {kernelStatus === 'ready'
                ? 'Kernel Ready'
                : kernelStatus === 'error'
                ? 'Connection Failed'
                : statusMessage || 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <article className="w-full pt-16 py-8 px-4">
        <div className="max-w-3xl mx-auto prose-medium">
          <section className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-accent font-medium mb-4">
              <span>🧠</span>
              <span>Interactive Tutorial</span>
            </div>
            <h1>JAX for Regression</h1>
            <p className="text-dark-muted text-lg">
              Build and train a neural network to fit a sine wave.
              <strong className="text-white"> Equinox + Optax in action.</strong>
            </p>
          </section>

          {/* Binder info banner */}
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <span className="text-blue-400 text-lg shrink-0">ℹ</span>
              <div className="text-sm">
                <div className="text-blue-300 font-medium mb-1">About the Python Environment</div>
                <p className="text-blue-400/80 leading-relaxed">
                  This tutorial uses <strong className="text-blue-300">MyBinder</strong>, a free community service that provides live Python execution.
                  Occasionally it may be slow or unavailable due to high demand. If connection fails, wait a few minutes and retry.
                  The <strong className="text-blue-300">Dynamic Mode</strong> walkthroughs work offline — use them to learn while Binder connects!
                </p>
              </div>
            </div>
          </div>

          {/* Kernel info */}
          {['building', 'launching', 'connecting'].includes(kernelStatus) && (
            <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-xl animate-spin">⟳</span>
                <div>
                  <div className="text-yellow-400 font-medium">Starting Python Environment</div>
                  <div className="text-yellow-600 text-sm">{statusMessage || 'This takes 30-60 seconds on first visit. Read ahead while it loads!'}</div>
                </div>
              </div>
            </div>
          )}

          {kernelStatus === 'error' && (
            <div className="bg-red-950/30 border border-red-800 rounded-xl p-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-red-500 text-xl">✗</span>
                  <div>
                    <div className="text-red-400 font-medium">Connection Failed</div>
                    <div className="text-red-600 text-sm">{statusMessage || 'Could not connect to Binder.'}</div>
                  </div>
                </div>
                <button
                  onClick={connect}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {kernelStatus === 'ready' && (
            <div className="bg-green-950/30 border border-green-800 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <div className="text-green-400 font-medium">Python Environment Ready</div>
                  <div className="text-green-600 text-sm">Click the green Run buttons to execute code cells.</div>
                </div>
              </div>
            </div>
          )}

          {/* Setup section */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-neutral-800">
              <h3 className="text-white font-semibold">Setup: Install Packages</h3>
              <p className="text-dark-muted text-sm mt-1">Run both cells below in order. Installation takes ~45 seconds.</p>
            </div>

            {/* Step 1: Install */}
            <div className="border-b border-neutral-800">
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <span className="text-dark-subtle text-xs font-mono uppercase tracking-wider">
                    Step 1: Install JAX + Equinox + Optax
                  </span>
                  {setupStatus.install === 'done' && <span className="text-green-500 text-xs">✓</span>}
                  {setupStatus.install === 'running' && <span className="text-yellow-500 text-xs animate-spin">⟳</span>}
                  {setupStatus.install === 'error' && <span className="text-red-500 text-xs">✗</span>}
                </div>
                <button
                  onClick={async () => {
                    setSetupStatus(s => ({ ...s, install: 'running' }))
                    try {
                      await runCode('import subprocess\nsubprocess.check_call(["pip", "install", "-q", "jax", "jaxlib", "equinox", "optax"])\nprint("JAX, Equinox, and Optax installed successfully!")')
                      setSetupStatus(s => ({ ...s, install: 'done' }))
                    } catch (e) {
                      console.error(e)
                      setSetupStatus(s => ({ ...s, install: 'error' }))
                    }
                  }}
                  disabled={!kernelReady || setupStatus.install === 'running'}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    kernelReady && setupStatus.install !== 'running'
                      ? setupStatus.install === 'done'
                        ? 'bg-green-700 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  {setupStatus.install === 'running' ? '⟳ Installing...' : setupStatus.install === 'done' ? '✓ Installed' : '▶ Install'}
                </button>
              </div>
              <pre className="!bg-[#0d1117] !m-0 p-4 overflow-x-auto">
                <code className="text-sm text-dark-muted font-mono">pip install jax jaxlib equinox optax</code>
              </pre>
            </div>

            {/* Step 2: Verify */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <span className="text-dark-subtle text-xs font-mono uppercase tracking-wider">
                    Step 2: Verify Installation
                  </span>
                  {setupStatus.imports === 'done' && <span className="text-green-500 text-xs">✓</span>}
                  {setupStatus.imports === 'running' && <span className="text-yellow-500 text-xs animate-spin">⟳</span>}
                  {setupStatus.imports === 'error' && <span className="text-red-500 text-xs">✗</span>}
                </div>
                <button
                  onClick={async () => {
                    setSetupStatus(s => ({ ...s, imports: 'running' }))
                    try {
                      await runCode('import jax\nimport equinox as eqx\nimport optax\nprint(f"JAX: {jax.__version__}")\nprint(f"Equinox: {eqx.__version__}")\nprint(f"Optax: {optax.__version__}")\nprint("\\nAll packages ready!")')
                      setSetupStatus(s => ({ ...s, imports: 'done' }))
                    } catch (e) {
                      console.error(e)
                      setSetupStatus(s => ({ ...s, imports: 'error' }))
                    }
                  }}
                  disabled={!kernelReady || setupStatus.imports === 'running'}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    kernelReady && setupStatus.imports !== 'running'
                      ? setupStatus.imports === 'done'
                        ? 'bg-green-700 text-white cursor-default'
                        : 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  {setupStatus.imports === 'running' ? '⟳ Checking...' : setupStatus.imports === 'done' ? '✓ Verified' : '▶ Verify'}
                </button>
              </div>
              <pre className="!bg-[#0d1117] !m-0 p-4 overflow-x-auto">
                <code className="text-sm text-dark-muted font-mono">import jax, equinox, optax</code>
              </pre>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={expandAll}
              className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-dark-muted hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-dark-muted hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </article>

      {/* Sections */}
      <section className="w-full px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          {sections.map((section, index) => (
            <div key={section.id}>
              {/* Insert Neural Net Lego before "Define the MLP Class" section */}
              {section.id === 'mlp-class' && (
                <div className="mb-6">
                  <div className="bg-purple-950/20 border border-purple-800/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-purple-300 mb-2">
                      <span>🧱</span>
                      <span className="font-semibold">Interactive: Build Your Own Network</span>
                    </div>
                    <p className="text-purple-400/80 text-sm">
                      Before we look at the code, try building the architecture visually.
                      The network we'll use has layers <code className="bg-purple-900/50 px-1 rounded">[1, 10, 10, 10, 1]</code> with Sigmoid activations.
                    </p>
                  </div>
                  <div className="w-[calc(100vw-2rem)] ml-[calc(-50vw+50%+1rem)]">
                    <NeuralNetLegoSim
                      lockedFramework="jax"
                      showFrameworkDropdown={false}
                      initialArchitecture={[
                        { neurons: 10, activation: 'sigmoid' },
                        { neurons: 10, activation: 'sigmoid' },
                        { neurons: 10, activation: 'sigmoid' },
                        { neurons: 1, activation: 'linear' },
                      ]}
                      height="800px"
                    />
                  </div>
                </div>
              )}
              <CollapsibleSection
                section={section}
                index={index}
                isOpen={openSections[section.id]}
                onToggle={() => toggleSection(section.id)}
                kernelReady={kernelReady}
                onRunCode={runCode}
              />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
