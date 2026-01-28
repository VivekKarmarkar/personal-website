import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

// Generate unit sphere points
function generateSphere(n = 2000) {
  const points = []
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(1 - 2 * Math.random())
    const theta = 2 * Math.PI * Math.random()
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    })
  }
  return points
}

// Matrix utilities
function identity() {
  return [[1,0,0], [0,1,0], [0,0,1]]
}

function rotation(axis, deg) {
  const rad = deg * Math.PI / 180
  const c = Math.cos(rad), s = Math.sin(rad)
  if (axis === 'x') return [[1,0,0], [0,c,-s], [0,s,c]]
  if (axis === 'y') return [[c,0,s], [0,1,0], [-s,0,c]]
  return [[c,-s,0], [s,c,0], [0,0,1]] // z
}

function scale(sx, sy, sz) {
  return [[sx,0,0], [0,sy,0], [0,0,sz]]
}

function transform(m, p) {
  return {
    x: m[0][0]*p.x + m[0][1]*p.y + m[0][2]*p.z,
    y: m[1][0]*p.x + m[1][1]*p.y + m[1][2]*p.z,
    z: m[2][0]*p.x + m[2][1]*p.y + m[2][2]*p.z
  }
}

export default function MatrixTransformsSim() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const pointsRef = useRef(null)
  const ghostRef = useRef(null)
  const originalPoints = useRef([])
  const frameId = useRef(null)

  // State
  const [mode, setMode] = useState('identity')
  const [axis, setAxis] = useState('z')
  const [angle, setAngle] = useState(45)
  const [uniformScale, setUniformScale] = useState(1)
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [scaleZ, setScaleZ] = useState(1)
  const [matrix, setMatrix] = useState(identity())
  const [showPanel, setShowPanel] = useState(true)

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(3, 2, 3)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Custom bold axes with labels
    const axisLength = 2
    const axisRadius = 0.03

    // Create axis line (cylinder)
    const createAxis = (color, rotation) => {
      const geo = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8)
      geo.translate(0, axisLength / 2, 0) // Move so it starts at origin
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.set(...rotation)
      return mesh
    }

    // Create text label sprite
    const createLabel = (text, color, position) => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = color
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 32, 32)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMat = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.set(...position)
      sprite.scale.set(0.4, 0.4, 1)
      return sprite
    }

    // X axis (red) - rotated to point along X
    const xAxis = createAxis(0xff4444, [0, 0, -Math.PI / 2])
    scene.add(xAxis)
    scene.add(createLabel('X', '#ff4444', [axisLength + 0.2, 0, 0]))

    // Y axis (green) - default cylinder orientation
    const yAxis = createAxis(0x44ff44, [0, 0, 0])
    scene.add(yAxis)
    scene.add(createLabel('Y', '#44ff44', [0, axisLength + 0.2, 0]))

    // Z axis (blue) - rotated to point along Z
    const zAxis = createAxis(0x4444ff, [Math.PI / 2, 0, 0])
    scene.add(zAxis)
    scene.add(createLabel('Z', '#4444ff', [0, 0, axisLength + 0.2]))

    // Grid
    scene.add(new THREE.GridHelper(4, 8, 0x444466, 0x333355))

    // Generate sphere points
    originalPoints.current = generateSphere(2000)

    // Create point cloud
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(2000 * 3)
    const colors = new Float32Array(2000 * 3)

    originalPoints.current.forEach((p, i) => {
      positions[i*3] = p.x
      positions[i*3+1] = p.y
      positions[i*3+2] = p.z
      // Red for z > 0, blue otherwise
      if (p.z > 0) {
        colors[i*3] = 1; colors[i*3+1] = 0.2; colors[i*3+2] = 0.2
      } else {
        colors[i*3] = 0.2; colors[i*3+1] = 0.2; colors[i*3+2] = 1
      }
    })

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({ size: 4, vertexColors: true, sizeAttenuation: false })
    const points = new THREE.Points(geo, mat)
    scene.add(points)
    pointsRef.current = points

    // Camera orbit controls
    let dragging = false
    let prevX = 0, prevY = 0
    let theta = Math.PI / 4, phi = Math.PI / 3
    const radius = 4

    const updateCamera = () => {
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta)
      camera.position.y = radius * Math.cos(phi)
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta)
      camera.lookAt(0, 0, 0)
    }
    updateCamera()

    const onDown = (e) => { dragging = true; prevX = e.clientX; prevY = e.clientY }
    const onUp = () => { dragging = false }
    const onMove = (e) => {
      if (!dragging) return
      theta -= (e.clientX - prevX) * 0.01
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + (e.clientY - prevY) * 0.01))
      updateCamera()
      prevX = e.clientX; prevY = e.clientY
    }

    renderer.domElement.addEventListener('mousedown', onDown)
    renderer.domElement.addEventListener('mouseup', onUp)
    renderer.domElement.addEventListener('mouseleave', onUp)
    renderer.domElement.addEventListener('mousemove', onMove)

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('mousedown', onDown)
      renderer.domElement.removeEventListener('mouseup', onUp)
      renderer.domElement.removeEventListener('mouseleave', onUp)
      renderer.domElement.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frameId.current)
      container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  // Update points when matrix changes
  useEffect(() => {
    if (!pointsRef.current || !sceneRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array

    originalPoints.current.forEach((p, i) => {
      const t = transform(matrix, p)
      positions[i*3] = t.x
      positions[i*3+1] = t.y
      positions[i*3+2] = t.z
    })

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Ghost sphere for non-identity
    if (mode !== 'identity') {
      if (!ghostRef.current) {
        const ghostGeo = new THREE.BufferGeometry()
        const ghostPos = new Float32Array(2000 * 3)
        originalPoints.current.forEach((p, i) => {
          ghostPos[i*3] = p.x; ghostPos[i*3+1] = p.y; ghostPos[i*3+2] = p.z
        })
        ghostGeo.setAttribute('position', new THREE.BufferAttribute(ghostPos, 3))
        const ghostMat = new THREE.PointsMaterial({ size: 2, color: 0x666688, transparent: true, opacity: 0.3, sizeAttenuation: false })
        ghostRef.current = new THREE.Points(ghostGeo, ghostMat)
        sceneRef.current.add(ghostRef.current)
      }
    } else if (ghostRef.current) {
      sceneRef.current.remove(ghostRef.current)
      ghostRef.current = null
    }
  }, [matrix, mode])

  // Compute matrix when params change
  useEffect(() => {
    let m
    switch (mode) {
      case 'rotation': m = rotation(axis, angle); break
      case 'uniform': m = scale(uniformScale, uniformScale, uniformScale); break
      case 'nonuniform': m = scale(scaleX, scaleY, scaleZ); break
      default: m = identity()
    }
    setMatrix(m)
  }, [mode, axis, angle, uniformScale, scaleX, scaleY, scaleZ])

  const reset = () => {
    setMode('identity')
    setAxis('z')
    setAngle(45)
    setUniformScale(1)
    setScaleX(1); setScaleY(1); setScaleZ(1)
  }

  return (
    <div className="h-[600px] w-full relative rounded-xl overflow-hidden">
      {/* Three.js container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 right-4 z-20 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {showPanel ? 'Hide' : 'Controls'}
      </button>

      {/* Control panel */}
      {showPanel && (
        <div className="absolute top-4 left-4 z-10 w-60 bg-white rounded-lg shadow-xl text-sm">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 rounded-t-lg">
            <h2 className="font-bold text-white">Matrix Transform</h2>
          </div>

          <div className="p-3 space-y-3">
            {/* Mode */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Transform</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white"
              >
                <option value="identity">Identity</option>
                <option value="rotation">Rotation</option>
                <option value="uniform">Uniform Scale</option>
                <option value="nonuniform">Non-uniform Scale</option>
              </select>
            </div>

            {/* Rotation controls */}
            {mode === 'rotation' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Axis</label>
                  <select value={axis} onChange={(e) => setAxis(e.target.value)} className="w-full px-2 py-1 border rounded bg-white">
                    <option value="x">X (Red)</option>
                    <option value="y">Y (Green)</option>
                    <option value="z">Z (Blue)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Angle: {angle}°</label>
                  <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" />
                </div>
              </>
            )}

            {/* Uniform scale */}
            {mode === 'uniform' && (
              <div>
                <label className="block text-xs font-medium text-gray-600">Scale: {uniformScale.toFixed(2)}</label>
                <input type="range" min="0.1" max="3" step="0.1" value={uniformScale} onChange={(e) => setUniformScale(+e.target.value)} className="w-full" />
              </div>
            )}

            {/* Non-uniform scale */}
            {mode === 'nonuniform' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600">X: {scaleX.toFixed(2)}</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={scaleX} onChange={(e) => setScaleX(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Y: {scaleY.toFixed(2)}</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={scaleY} onChange={(e) => setScaleY(+e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Z: {scaleZ.toFixed(2)}</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={scaleZ} onChange={(e) => setScaleZ(+e.target.value)} className="w-full" />
                </div>
              </>
            )}

            <button onClick={reset} className="w-full py-1.5 bg-gray-100 rounded hover:bg-gray-200 border">Reset</button>

            {/* Matrix display */}
            <div className="pt-2 border-t">
              <label className="block text-xs font-medium text-gray-600 mb-1">Matrix</label>
              <div className="bg-gray-900 p-2 rounded font-mono text-xs text-cyan-400">
                {matrix.map((row, i) => (
                  <div key={i} className="flex justify-around">
                    {row.map((v, j) => <span key={j}>{v.toFixed(2)}</span>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
