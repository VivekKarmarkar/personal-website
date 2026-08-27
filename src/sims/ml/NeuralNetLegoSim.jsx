import { useState, useCallback, useEffect, useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-julia'

// Activation function definitions
const ACTIVATIONS = {
  relu: { symbol: '/', label: 'ReLU', color: '#FF6319', jax: 'jax.nn.relu', pytorch: 'nn.ReLU()', tf: "'relu'", julia: 'relu', fn: x => Math.max(0, x) },
  sigmoid: { symbol: 'σ', label: 'Sigmoid', color: '#0039A6', jax: 'jax.nn.sigmoid', pytorch: 'nn.Sigmoid()', tf: "'sigmoid'", julia: 'sigmoid', fn: x => 1 / (1 + Math.exp(-x)) },
  tanh: { symbol: '∿', label: 'Tanh', color: '#6CBE45', jax: 'jnp.tanh', pytorch: 'nn.Tanh()', tf: "'tanh'", julia: 'tanh', fn: x => Math.tanh(x) },
  linear: { symbol: '—', label: 'Linear', color: '#888888', jax: null, pytorch: null, tf: null, julia: 'identity', fn: x => x },
}

const ACTIVATION_ORDER = ['relu', 'sigmoid', 'tanh', 'linear']

// Limits
const MAX_NEURONS = 10
const MAX_HIDDEN_LAYERS = 3

// Generate unique IDs
let idCounter = 0
const generateId = () => `id-${++idCounter}`

// Generate random weights between -1 and 1
const generateWeights = (fromCount, toCount) => {
  const weights = []
  for (let i = 0; i < fromCount; i++) {
    weights[i] = []
    for (let j = 0; j < toCount; j++) {
      weights[i][j] = (Math.random() * 2 - 1) * 0.5 // Random between -0.5 and 0.5
    }
  }
  return weights
}

// Forward pass to compute activations
const computeActivations = (inputValue, layers, allWeights) => {
  const activations = [[inputValue]] // Start with input

  let current = [inputValue]

  layers.forEach((layer, layerIdx) => {
    const weights = allWeights[layerIdx]
    if (!weights) {
      activations.push(Array(layer.neuronCount).fill(0))
      return
    }

    const next = []
    for (let j = 0; j < layer.neuronCount; j++) {
      let sum = 0
      for (let i = 0; i < current.length; i++) {
        sum += current[i] * (weights[i]?.[j] || 0)
      }
      // Apply activation (except for output layer)
      const isOutput = layerIdx === layers.length - 1
      const actFn = isOutput ? ACTIVATIONS.linear.fn : ACTIVATIONS[layer.activation].fn
      next.push(actFn(sum))
    }
    activations.push(next)
    current = next
  })

  return activations
}

// Check if all hidden layers have the same activation
const allSameActivation = (layers) => {
  if (layers.length <= 1) return true
  const hiddenLayers = layers.slice(0, -1)
  if (hiddenLayers.length === 0) return true
  const first = hiddenLayers[0].activation
  return hiddenLayers.every(l => l.activation === first)
}

// Code generation - JAX/Equinox
const generateJaxCode = (layers, inputSize, optimized) => {
  if (layers.length === 0) return `# Add layers to generate code`

  const sizes = [inputSize, ...layers.map(l => l.neuronCount)]
  const numLayers = layers.length

  if (optimized && allSameActivation(layers)) {
    const activation = layers[0]?.activation || 'relu'
    const activationFunc = ACTIVATIONS[activation].jax || 'lambda x: x'

    return `import jax
import jax.numpy as jnp
import equinox as eqx

class MLP(eqx.Module):
    layers: list
    activation: callable

    def __init__(self, layer_sizes, key):
        keys = jax.random.split(key, len(layer_sizes) - 1)
        self.layers = [
            eqx.nn.Linear(layer_sizes[i], layer_sizes[i+1], key=keys[i])
            for i in range(len(layer_sizes) - 1)
        ]
        self.activation = ${activationFunc}

    def __call__(self, x):
        for layer in self.layers[:-1]:
            x = self.activation(layer(x))
        return self.layers[-1](x)

# Architecture: ${sizes.join(' → ')}
layer_sizes = ${JSON.stringify(sizes)}
model = MLP(layer_sizes, jax.random.PRNGKey(42))`
  } else {
    const layerDefs = layers.map((layer, i) => {
      return `            eqx.nn.Linear(${sizes[i]}, ${sizes[i+1]}, key=keys[${i}]),`
    }).join('\n')

    // Build forward pass with per-layer activations
    let forwardCode = ''
    for (let i = 0; i < layers.length - 1; i++) {
      const actFunc = ACTIVATIONS[layers[i].activation].jax
      if (actFunc) {
        forwardCode += `        x = ${actFunc}(self.layers[${i}](x))\n`
      } else {
        forwardCode += `        x = self.layers[${i}](x)\n`
      }
    }
    forwardCode += `        return self.layers[${layers.length - 1}](x)`

    return `import jax
import jax.numpy as jnp
import equinox as eqx

class MLP(eqx.Module):
    layers: list

    def __init__(self, key):
        keys = jax.random.split(key, ${numLayers})
        self.layers = [
${layerDefs}
        ]

    def __call__(self, x):
${forwardCode}

# Architecture: ${sizes.join(' → ')}
model = MLP(jax.random.PRNGKey(42))`
  }
}

// Code generation - PyTorch
const generatePyTorchCode = (layers, inputSize, optimized) => {
  if (layers.length === 0) return `# Add layers to generate code`

  const sizes = [inputSize, ...layers.map(l => l.neuronCount)]

  if (optimized && allSameActivation(layers)) {
    const activation = layers[0]?.activation || 'relu'
    const actClass = ACTIVATIONS[activation].pytorch

    return `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, layer_sizes):
        super().__init__()
        layers = []
        for i in range(len(layer_sizes) - 1):
            layers.append(nn.Linear(layer_sizes[i], layer_sizes[i+1]))
            if i < len(layer_sizes) - 2:
                layers.append(${actClass || 'nn.Identity()'})
        self.net = nn.Sequential(*layers)

    def forward(self, x):
        return self.net(x)

# Architecture: ${sizes.join(' → ')}
layer_sizes = ${JSON.stringify(sizes)}
model = MLP(layer_sizes)`
  } else {
    // Build sequential with per-layer activations
    let seqLayers = []
    for (let i = 0; i < layers.length; i++) {
      seqLayers.push(`            nn.Linear(${sizes[i]}, ${sizes[i+1]}),`)
      if (i < layers.length - 1) {
        const actClass = ACTIVATIONS[layers[i].activation].pytorch
        if (actClass) {
          seqLayers.push(`            ${actClass},`)
        }
      }
    }

    return `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
${seqLayers.join('\n')}
        )

    def forward(self, x):
        return self.net(x)

# Architecture: ${sizes.join(' → ')}
model = MLP()`
  }
}

// Code generation - TensorFlow/Keras
const generateTensorFlowCode = (layers, inputSize, optimized) => {
  if (layers.length === 0) return `# Add layers to generate code`

  const sizes = [inputSize, ...layers.map(l => l.neuronCount)]

  if (optimized && allSameActivation(layers)) {
    const activation = layers[0]?.activation || 'relu'
    const actStr = ACTIVATIONS[activation].tf

    return `import tensorflow as tf
from tensorflow import keras

def create_mlp(layer_sizes, activation=${actStr}):
    model = keras.Sequential([keras.layers.Input(shape=(layer_sizes[0],))])
    for i, size in enumerate(layer_sizes[1:]):
        act = activation if i < len(layer_sizes) - 2 else None
        model.add(keras.layers.Dense(size, activation=act))
    return model

# Architecture: ${sizes.join(' → ')}
layer_sizes = ${JSON.stringify(sizes)}
model = create_mlp(layer_sizes)`
  } else {
    let layerDefs = []
    for (let i = 0; i < layers.length; i++) {
      const actStr = i < layers.length - 1 ? ACTIVATIONS[layers[i].activation].tf : null
      const actPart = actStr ? `, activation=${actStr}` : ''
      const inputPart = i === 0 ? `, input_shape=(${sizes[0]},)` : ''
      layerDefs.push(`    keras.layers.Dense(${sizes[i+1]}${actPart}${inputPart}),`)
    }

    return `import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
${layerDefs.join('\n')}
])

# Architecture: ${sizes.join(' → ')}
model.compile(optimizer='adam', loss='mse')`
  }
}

// Code generation - Julia/Flux
const generateJuliaCode = (layers, inputSize, optimized) => {
  if (layers.length === 0) return `# Add layers to generate code`

  const sizes = [inputSize, ...layers.map(l => l.neuronCount)]

  if (optimized && allSameActivation(layers)) {
    const activation = layers[0]?.activation || 'relu'
    const actFunc = ACTIVATIONS[activation].julia

    return `using Flux

function create_mlp(layer_sizes, activation=${actFunc})
    layers = []
    for i in 1:length(layer_sizes)-1
        act = i < length(layer_sizes)-1 ? activation : identity
        push!(layers, Dense(layer_sizes[i] => layer_sizes[i+1], act))
    end
    return Chain(layers...)
end

# Architecture: ${sizes.join(' → ')}
layer_sizes = ${JSON.stringify(sizes)}
model = create_mlp(layer_sizes)`
  } else {
    let layerDefs = []
    for (let i = 0; i < layers.length; i++) {
      const actFunc = i < layers.length - 1 ? ACTIVATIONS[layers[i].activation].julia : 'identity'
      layerDefs.push(`    Dense(${sizes[i]} => ${sizes[i+1]}, ${actFunc}),`)
    }

    return `using Flux

model = Chain(
${layerDefs.join('\n')}
)

# Architecture: ${sizes.join(' → ')}`
  }
}

const CODE_GENERATORS = {
  jax: generateJaxCode,
  pytorch: generatePyTorchCode,
  tensorflow: generateTensorFlowCode,
  julia: generateJuliaCode,
}

const FRAMEWORK_LABELS = {
  jax: 'JAX / Equinox',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow / Keras',
  julia: 'Julia / Flux',
}

// Main component
export default function NeuralNetLegoSim({
  lockedFramework = null,
  initialArchitecture = null,
  showFrameworkDropdown = true,
  height = '800px',
  inputSize = 1,
}) {
  // Initialize layers from props or empty
  const [layers, setLayers] = useState(() => {
    if (initialArchitecture) {
      return initialArchitecture.map((config) => ({
        id: generateId(),
        neuronCount: Math.min(config.neurons, MAX_NEURONS),
        activation: config.activation || 'relu',
      }))
    }
    return []
  })

  const [selectedFramework, setSelectedFramework] = useState(lockedFramework || 'jax')
  const [copied, setCopied] = useState(false)
  const [codeMode, setCodeMode] = useState('raw')
  const [inputValue, setInputValue] = useState(0.5)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // layerIdx waiting for confirmation
  const [showOutputValues, setShowOutputValues] = useState(false)
  const dividerPosition = 50 // Fixed at 50%

  // Generate/regenerate weights when layers change
  const [allWeights, setAllWeights] = useState([])

  useEffect(() => {
    const sizes = [inputSize, ...layers.map(l => l.neuronCount)]
    const newWeights = []
    for (let i = 0; i < sizes.length - 1; i++) {
      newWeights.push(generateWeights(sizes[i], sizes[i + 1]))
    }
    setAllWeights(newWeights)
  }, [layers, inputSize])

  // Compute activations
  const activations = useMemo(() => {
    return computeActivations(inputValue, layers, allWeights)
  }, [inputValue, layers, allWeights])

  // Generate code
  const code = CODE_GENERATORS[selectedFramework](layers, inputSize, codeMode === 'optimized')
  const highlightedCode = Prism.highlight(
    code,
    selectedFramework === 'julia' ? Prism.languages.julia : Prism.languages.python,
    selectedFramework === 'julia' ? 'julia' : 'python'
  )

  const canOptimize = layers.length > 1 && allSameActivation(layers)

  // Layer manipulation
  const addLayer = useCallback(() => {
    const hiddenCount = layers.length > 0 ? layers.length - 1 : 0
    if (hiddenCount >= MAX_HIDDEN_LAYERS) return

    if (layers.length === 0) {
      // First layer - add both hidden and output
      setLayers([
        { id: generateId(), neuronCount: 4, activation: 'relu' },
        { id: generateId(), neuronCount: 1, activation: 'linear' },
      ])
    } else {
      // Insert new hidden layer before output
      setLayers(prev => {
        const newLayers = [...prev]
        const outputLayer = newLayers.pop()
        newLayers.push({ id: generateId(), neuronCount: 4, activation: 'relu' })
        newLayers.push(outputLayer)
        return newLayers
      })
    }
    setDeleteConfirm(null)
  }, [layers.length])

  const removeLayer = useCallback((index) => {
    if (deleteConfirm === index) {
      // Second click - actually delete
      setLayers(prev => {
        // Don't allow deleting if only 2 layers (1 hidden + output)
        if (prev.length <= 2) return prev
        // Don't allow deleting output layer
        if (index === prev.length - 1) return prev
        return prev.filter((_, i) => i !== index)
      })
      setDeleteConfirm(null)
    } else {
      // First click - show confirmation
      setDeleteConfirm(index)
    }
  }, [deleteConfirm])

  const addNeuron = useCallback((layerIdx) => {
    setLayers(prev => prev.map((layer, i) => {
      if (i === layerIdx && layer.neuronCount < MAX_NEURONS) {
        return { ...layer, neuronCount: layer.neuronCount + 1 }
      }
      return layer
    }))
  }, [])

  const removeNeuron = useCallback((layerIdx) => {
    setLayers(prev => prev.map((layer, i) => {
      if (i === layerIdx && layer.neuronCount > 1) {
        return { ...layer, neuronCount: layer.neuronCount - 1 }
      }
      return layer
    }))
  }, [])

  const cycleActivation = useCallback((layerIdx) => {
    // Don't allow changing output layer activation
    if (layerIdx === layers.length - 1) return

    setLayers(prev => prev.map((layer, i) => {
      if (i === layerIdx) {
        const currentIdx = ACTIVATION_ORDER.indexOf(layer.activation)
        const nextIdx = (currentIdx + 1) % ACTIVATION_ORDER.length
        return { ...layer, activation: ACTIVATION_ORDER[nextIdx] }
      }
      return layer
    }))
  }, [layers.length])

  const clearAll = useCallback(() => {
    setLayers([])
    setDeleteConfirm(null)
  }, [])

  const loadExample = useCallback(() => {
    setLayers([
      { id: generateId(), neuronCount: 4, activation: 'relu' },
      { id: generateId(), neuronCount: 4, activation: 'relu' },
      { id: generateId(), neuronCount: 1, activation: 'linear' },
    ])
    setDeleteConfirm(null)
  }, [])

  const randomizeWeights = useCallback(() => {
    const sizes = [inputSize, ...layers.map(l => l.neuronCount)]
    const newWeights = []
    for (let i = 0; i < sizes.length - 1; i++) {
      newWeights.push(generateWeights(sizes[i], sizes[i + 1]))
    }
    setAllWeights(newWeights)
  }, [layers, inputSize])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Click outside to cancel delete confirmation
  const handleBackgroundClick = () => {
    setDeleteConfirm(null)
  }



  // Layout calculations
  const layerSpacing = 120
  const neuronSpacing = 36
  const neuronRadius = 16
  const startX = 100
  const canvasWidth = startX + (layers.length + 2) * layerSpacing + 80

  // Calculate exact heights for 10 neurons (no scrolling!)
  // 10 neurons: centers span (10-1)*36 = 324px, plus radius on each end = 324 + 32 = 356px
  const maxNeuronHeight = (MAX_NEURONS - 1) * neuronSpacing + 2 * neuronRadius // 356px

  // Layout from top to bottom:
  const labelY = 25                           // Layer labels
  const activationBoxY = 50                   // Activation selector (height 26)
  const activationBoxBottom = 76
  const neuronsTopMargin = 15                 // Gap between activation box and neurons
  const neuronsStartY = activationBoxBottom + neuronsTopMargin  // 91
  const neuronsEndY = neuronsStartY + maxNeuronHeight           // 91 + 356 = 447
  const neuronsBottomMargin = 15
  const neuronControlsY = neuronsEndY + neuronsBottomMargin     // 462
  const neuronControlsHeight = 30
  const deleteButtonY = neuronControlsY + neuronControlsHeight + 10  // 502
  const deleteButtonHeight = 24
  const canvasHeight = deleteButtonY + deleteButtonHeight + 15  // 541

  // Center point for neurons
  const neuronsCenterY = neuronsStartY + maxNeuronHeight / 2    // 91 + 178 = 269

  const getLayerPositions = () => {
    const positions = []

    // Input layer
    positions.push({
      x: startX,
      neurons: Array.from({ length: inputSize }, (_, i) => ({
        y: neuronsCenterY - ((inputSize - 1) * neuronSpacing) / 2 + i * neuronSpacing
      }))
    })

    // Hidden + output layers
    layers.forEach((layer, idx) => {
      const x = startX + (idx + 1) * layerSpacing
      const count = layer.neuronCount
      positions.push({
        x,
        neurons: Array.from({ length: count }, (_, i) => ({
          y: neuronsCenterY - ((count - 1) * neuronSpacing) / 2 + i * neuronSpacing
        }))
      })
    })

    return positions
  }

  const layerPositions = getLayerPositions()

  // Get weight line thickness (0.5 to 4 based on absolute weight)
  const getLineWidth = (weight) => {
    return 0.5 + Math.abs(weight) * 7
  }

  // Get line color based on weight sign
  const getLineColor = (weight) => {
    return weight >= 0 ? '#4ade80' : '#f87171'
  }

  // Get neuron fill opacity based on activation (only positive values show fill)
  const getNeuronOpacity = (value) => {
    if (value <= 0) return 0
    return Math.min(0.8, value * 0.8) // Scale positive values to 0-0.8 opacity
  }

  return (
    <div
      className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
      style={{ height }}
    >
      {/* Full screen warning */}
      <div className="bg-yellow-900/30 border-b border-yellow-700/50 px-4 py-1.5 text-center">
        <span className="text-yellow-400 text-xs font-semibold tracking-wide">
          ⚠ USE ONLY IN FULL SCREEN MODE
        </span>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Left: Building Area */}
        <div
          className="flex flex-col border-r border-neutral-800 min-w-0"
          style={{ width: `${dividerPosition}%` }}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-neutral-800 bg-[#161b22] flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm">Neural Net Lego</h3>
              <p className="text-dark-muted text-xs">Click activation symbol to change • Double-click delete to confirm</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={randomizeWeights}
                className="px-2 py-1 text-xs text-dark-muted hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title="Randomize weights"
              >
                🎲
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1 text-xs text-dark-muted hover:text-white hover:bg-neutral-800 rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={loadExample}
                className="px-3 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded transition-colors"
              >
                Example
              </button>
            </div>
          </div>

          {/* Input slider */}
          <div className="px-4 py-2 border-b border-neutral-800 bg-[#0d1117] flex items-center gap-4">
            <span className="text-xs text-dark-muted">Input x:</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-accent font-mono w-12">{inputValue.toFixed(1)}</span>
            <div className="border-l border-neutral-700 pl-4 flex items-center gap-2">
              <span className="text-xs text-dark-muted">Output:</span>
              <button
                onClick={() => setShowOutputValues(!showOutputValues)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  showOutputValues
                    ? 'bg-green-600/20 text-green-400 border border-green-600/50'
                    : 'bg-neutral-800 text-dark-muted hover:text-white'
                }`}
              >
                {showOutputValues ? 'Show' : 'Hide'}
              </button>
            </div>
          </div>

          {/* Network visualization */}
          <div
            className="flex-1 relative bg-[#0a0a0a]"
            onClick={handleBackgroundClick}
          >
            <svg width={canvasWidth} height={canvasHeight} className="min-w-full">
              {/* Draw connections with weight-based thickness */}
              {layerPositions.slice(0, -1).map((fromLayer, layerIdx) => {
                const toLayer = layerPositions[layerIdx + 1]
                const weights = allWeights[layerIdx]
                if (!toLayer || !weights) return null

                return fromLayer.neurons.map((fromNeuron, fromIdx) =>
                  toLayer.neurons.map((toNeuron, toIdx) => {
                    const weight = weights[fromIdx]?.[toIdx] || 0
                    return (
                      <line
                        key={`${layerIdx}-${fromIdx}-${toIdx}`}
                        x1={fromLayer.x + neuronRadius}
                        y1={fromNeuron.y}
                        x2={toLayer.x - neuronRadius}
                        y2={toNeuron.y}
                        stroke={getLineColor(weight)}
                        strokeWidth={getLineWidth(weight)}
                        opacity="0.6"
                      />
                    )
                  })
                )
              })}

              {/* Input neuron */}
              <g>
                <circle
                  cx={startX}
                  cy={neuronsCenterY}
                  r={neuronRadius}
                  fill={`rgba(252, 204, 10, ${getNeuronOpacity(inputValue)})`}
                  stroke="#FCCC0A"
                  strokeWidth="2"
                />
                <text
                  x={startX}
                  y={neuronsCenterY + 4}
                  textAnchor="middle"
                  fill="#FCCC0A"
                  fontSize="12"
                  fontWeight="bold"
                >
                  x
                </text>
                <text
                  x={startX}
                  y={labelY}
                  textAnchor="middle"
                  fill="#888"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Input
                </text>
              </g>

              {/* Layers */}
              {layers.map((layer, layerIdx) => {
                const pos = layerPositions[layerIdx + 1]
                const isOutput = layerIdx === layers.length - 1
                const layerActivations = activations[layerIdx + 1] || []
                const config = ACTIVATIONS[layer.activation]

                return (
                  <g key={layer.id}>
                    {/* Layer label */}
                    <text
                      x={pos.x}
                      y={labelY}
                      textAnchor="middle"
                      fill="#888"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {isOutput ? 'Output' : `Hidden ${layerIdx + 1}`}
                    </text>

                    {/* Activation selector (not for output) */}
                    {!isOutput && (
                      <g
                        onClick={(e) => {
                          e.stopPropagation()
                          cycleActivation(layerIdx)
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={pos.x - 38}
                          y={activationBoxY}
                          width={76}
                          height={26}
                          rx={6}
                          fill="#1a1a1a"
                          stroke={config.color}
                          strokeWidth="2"
                        />
                        <text
                          x={pos.x}
                          y={activationBoxY + 18}
                          textAnchor="middle"
                          fill={config.color}
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {config.symbol} {config.label}
                        </text>
                      </g>
                    )}

                    {/* Neurons */}
                    {Array.from({ length: layer.neuronCount }).map((_, nIdx) => {
                      const neuronY = pos.neurons[nIdx]?.y || canvasHeight / 2
                      const activation = layerActivations[nIdx] || 0
                      const color = isOutput ? '#22c55e' : config.color

                      return (
                        <g key={nIdx}>
                          <circle
                            cx={pos.x}
                            cy={neuronY}
                            r={neuronRadius}
                            fill={`${color}${Math.round(getNeuronOpacity(activation) * 255).toString(16).padStart(2, '0')}`}
                            stroke={color}
                            strokeWidth="2"
                          />
                          {isOutput && (
                            <text
                              x={pos.x}
                              y={neuronY + 4}
                              textAnchor="middle"
                              fill={color}
                              fontSize="12"
                              fontWeight="bold"
                            >
                              y{layer.neuronCount > 1 ? nIdx + 1 : ''}
                            </text>
                          )}
                        </g>
                      )
                    })}

                    {/* Neuron controls */}
                    <g>
                      <rect
                        x={pos.x - 35}
                        y={neuronControlsY}
                        width={70}
                        height={30}
                        rx={6}
                        fill="#1a1a1a"
                        stroke="#444"
                        strokeWidth="1.5"
                      />
                      {/* Minus */}
                      <text
                        x={pos.x - 20}
                        y={neuronControlsY + 21}
                        textAnchor="middle"
                        fill={layer.neuronCount > 1 ? '#f87171' : '#333'}
                        fontSize="20"
                        fontWeight="bold"
                        style={{ cursor: layer.neuronCount > 1 ? 'pointer' : 'default' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNeuron(layerIdx)
                        }}
                      >
                        −
                      </text>
                      {/* Count */}
                      <text
                        x={pos.x}
                        y={neuronControlsY + 21}
                        textAnchor="middle"
                        fill="#aaa"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {layer.neuronCount}
                      </text>
                      {/* Plus */}
                      <text
                        x={pos.x + 20}
                        y={neuronControlsY + 21}
                        textAnchor="middle"
                        fill={layer.neuronCount < MAX_NEURONS ? '#4ade80' : '#333'}
                        fontSize="20"
                        fontWeight="bold"
                        style={{ cursor: layer.neuronCount < MAX_NEURONS ? 'pointer' : 'default' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          addNeuron(layerIdx)
                        }}
                      >
                        +
                      </text>
                    </g>

                    {/* Delete button (only for hidden layers when more than 1 hidden layer) */}
                    {!isOutput && layers.length > 2 && (
                      <g
                        onClick={(e) => {
                          e.stopPropagation()
                          removeLayer(layerIdx)
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={pos.x - 30}
                          y={deleteButtonY}
                          width={60}
                          height={24}
                          rx={6}
                          fill={deleteConfirm === layerIdx ? '#dc2626' : '#7f1d1d'}
                        />
                        <text
                          x={pos.x}
                          y={deleteButtonY + 17}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {deleteConfirm === layerIdx ? 'Confirm?' : 'Delete'}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Add layer button OR Output values */}
              {layers.length === 0 ? (
                <g
                  onClick={addLayer}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={startX + layerSpacing - 40}
                    y={neuronsCenterY - 40}
                    width={80}
                    height={80}
                    rx={12}
                    fill="transparent"
                    stroke="#555"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                  />
                  <text
                    x={startX + layerSpacing}
                    y={neuronsCenterY + 8}
                    textAnchor="middle"
                    fill="#888"
                    fontSize="32"
                  >
                    +
                  </text>
                  <text
                    x={startX + layerSpacing}
                    y={neuronsCenterY + 60}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="12"
                  >
                    Add Layer
                  </text>
                </g>
              ) : showOutputValues ? (
                // Show output values
                <g>
                  {(() => {
                    const outputLayer = layers[layers.length - 1]
                    const outputPos = layerPositions[layers.length]
                    const outputActivations = activations[activations.length - 1] || []
                    return outputActivations.map((value, idx) => {
                      const neuronY = outputPos.neurons[idx]?.y || neuronsCenterY
                      return (
                        <g key={idx}>
                          <rect
                            x={outputPos.x + 35}
                            y={neuronY - 12}
                            width={70}
                            height={24}
                            rx={4}
                            fill="#0d1117"
                            stroke="#22c55e"
                            strokeWidth="1"
                          />
                          <text
                            x={outputPos.x + 70}
                            y={neuronY + 5}
                            textAnchor="middle"
                            fill="#22c55e"
                            fontSize="13"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {value.toFixed(3)}
                          </text>
                        </g>
                      )
                    })
                  })()}
                </g>
              ) : (
                // Show add layer button
                layers.length - 1 < MAX_HIDDEN_LAYERS && (
                  <g
                    onClick={addLayer}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={layerPositions[layers.length].x + layerSpacing / 2}
                      cy={neuronsCenterY}
                      r={28}
                      fill="transparent"
                      stroke="#555"
                      strokeWidth="2"
                      strokeDasharray="6,3"
                    />
                    <text
                      x={layerPositions[layers.length].x + layerSpacing / 2}
                      y={neuronsCenterY + 8}
                      textAnchor="middle"
                      fill="#888"
                      fontSize="28"
                    >
                      +
                    </text>
                  </g>
                )
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 border-t border-neutral-800 bg-[#0d1117]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-dark-muted">Weights:</span>
                <span className="flex items-center gap-1">
                  <span className="w-8 h-0.5 bg-green-400"></span>
                  <span className="text-green-400">+ve</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-8 h-0.5 bg-red-400"></span>
                  <span className="text-red-400">−ve</span>
                </span>
                <span className="text-dark-muted">(thickness = magnitude)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-dark-muted">Neuron fill = activation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-1 bg-neutral-800 flex-shrink-0" />

        {/* Right: Code Panel */}
        <div
          className="flex flex-col bg-[#0d1117]"
          style={{ width: `${100 - dividerPosition}%` }}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-muted font-mono uppercase tracking-wider">
                Generated Code
              </span>
              {showFrameworkDropdown && !lockedFramework ? (
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="bg-neutral-800 text-white text-xs rounded px-2 py-1 border border-neutral-700"
                >
                  {Object.entries(FRAMEWORK_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-accent">{FRAMEWORK_LABELS[selectedFramework]}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-muted">Style:</span>
              <button
                onClick={() => setCodeMode('raw')}
                className={`px-2 py-0.5 text-xs rounded ${
                  codeMode === 'raw' ? 'bg-accent/20 text-accent' : 'text-dark-muted hover:text-white'
                }`}
              >
                Raw
              </button>
              <button
                onClick={() => setCodeMode('optimized')}
                disabled={!canOptimize}
                className={`px-2 py-0.5 text-xs rounded ${
                  codeMode === 'optimized'
                    ? 'bg-accent/20 text-accent'
                    : canOptimize ? 'text-dark-muted hover:text-white' : 'text-neutral-600 cursor-not-allowed'
                }`}
              >
                Optimized
              </button>
              {!canOptimize && layers.length > 1 && (
                <span className="text-xs text-neutral-600">(mixed activations)</span>
              )}
            </div>
          </div>

          {/* Code */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-xs font-mono leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>

          {/* Copy */}
          <div className="px-4 py-2 border-t border-neutral-800">
            <button
              onClick={copyCode}
              className={`w-full py-2 rounded text-sm font-semibold ${
                copied ? 'bg-green-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
