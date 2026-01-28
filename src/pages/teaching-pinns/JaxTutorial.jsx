import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-tomorrow.css'

// Syntax highlighting function
const highlightCode = (code) => {
  return Prism.highlight(code, Prism.languages.python, 'python')
}

// Simple markdown-like renderer for explanations
const renderExplanation = (text) => {
  // Split into paragraphs
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

// Direct Binder connection fallback
// This connects to Binder using EventSource/WebSocket directly
const connectDirectToBinder = async (mounted, setKernelStatus, setStatusMessage, setKernelReady, kernelRef) => {
  if (!mounted) return

  setKernelStatus('building')
  setStatusMessage('Connecting to Binder...')

  const binderUrl = 'https://mybinder.org/build/gh/binder-examples/requirements/HEAD'

  try {
    // Connect using EventSource for Server-Sent Events
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

          // Now connect to the kernel
          const serverUrl = data.url
          const token = data.token

          // Start a kernel
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

          // Connect via WebSocket
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
        // Ignore parse errors for non-JSON messages
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

    // Timeout after 5 minutes
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
    id: 'lambda',
    title: 'The Lambda Function',
    description: 'Lambda functions are anonymous one-liners — perfect for automatic differentiation.',
    code: `# Lambda vs regular function
sq_fn = lambda x: jnp.square(x)

def reg_sq_fn(x):
    return jnp.square(x)

# Both work identically
print(f"Lambda: {sq_fn(3)}")
print(f"Regular: {reg_sq_fn(3)}")

# But notice the difference
print(f"\\nLambda repr: {sq_fn}")
print(f"Regular repr: {reg_sq_fn}")`,
    explanation: `Here's something beautiful about lambda functions: they're *anonymous*. Run the code above and look at what gets printed — the regular function proudly announces its name, while the lambda simply says "I'm a function at this memory address." No name. No identity. Just pure transformation.

But why should you care? Because this anonymity maps *perfectly* onto how we think about differentiation. When you write \`lambda x: f(x)\`, you're essentially saying "here's a function of x" — and that's exactly the language of calculus. "Take the derivative of f with respect to x."

This isn't a coincidence. JAX's autodiff was designed with this syntax in mind. When you write \`jax.grad(lambda x: x**2)\`, you're writing mathematics as code. The lambda *is* the function you're differentiating. Clean. Elegant. Powerful.`,
  },
  {
    id: 'comprehension',
    title: 'List Comprehension',
    description: 'Compact syntax for creating lists — a Pythonic alternative to loops.',
    code: `# List comprehension vs for loop
y_lc = [x**2 for x in range(5)]

y_reg = []
for x in range(5):
    y_reg.append(x**2)

print("List comprehension:", y_lc)
print("For loop:", y_reg)

# With JAX arrays (converted to list for clean output)
jax_squares = [int(jnp.square(x)) for x in range(5)]
print("JAX squares:", jax_squares)`,
    explanation: `Four lines of code compressed into one. That's the magic of list comprehensions.

Look at the for-loop version: you create an empty list, iterate through values, compute something, append it. It's mechanical. Verbose. The list comprehension does the same thing but reads almost like English: "give me x squared for each x in this range."

You'll see list comprehensions everywhere in scientific Python — they're the idiomatic way to transform data. But here's a secret: for performance-critical code in JAX, you'll eventually want to replace even these with \`vmap\` (which we'll cover soon). List comprehensions are still Python loops under the hood, and loops are slow. But for prototyping and clarity? They're unbeatable.`,
  },
  {
    id: 'enumerate',
    title: 'Enumerate & Zip',
    description: 'Essential tools for iterating with indices and combining multiple sequences.',
    code: `# Enumerate: loop with index
squares = [0, 1, 4, 9, 16]
print("Enumerate example:")
for idx, item in enumerate(squares):
    print(f"  Index {idx}: {idx}² = {item}")

# Zip: combine multiple lists
print("\\nZip example:")
list_one = [1, 2, 3]
list_two = [99, 98, 97]
for a, b in zip(list_one, list_two):
    print(f"  {a} + {b} = {a + b}")`,
    explanation: `Two tools that will save you from writing ugly code.

**Enumerate** solves a common problem: "I need both the item AND its position." Without it, you'd write \`for i in range(len(items))\` and then access \`items[i]\`. Ugly. Error-prone. With enumerate, you get both delivered on a silver platter: \`for i, item in enumerate(items)\`.

**Zip** is for parallel iteration. Imagine you have positions in one array and velocities in another. You need to process them together. Zip creates pairs: first position with first velocity, second with second, and so on. It's like a zipper joining two sides together — hence the name.

In physics simulations, you'll use these constantly. Enumerate for tracking time indices. Zip for combining state vectors. They're small tools, but they make your code read like the mathematics it represents.`,
  },
  {
    id: 'decorators',
    title: 'Decorators & JIT Compilation',
    description: 'Decorators enhance functions. JAX\'s @jit decorator compiles for massive speedups.',
    code: `# A simple decorator example
def my_decorator(func):
    def wrapper():
        print("Before the function runs...")
        func()
        print("After the function runs!")
    return wrapper

@my_decorator
def say_hello():
    print("Hello, World!")

say_hello()`,
    explanation: `Decorators are function enhancers. They take a function and return a supercharged version of it.

Look at what happens here: \`say_hello\` originally just prints "Hello, World!" But the decorator wraps it — adding behavior before and after. The \`@decorator\` syntax is just a beautiful shorthand for \`say_hello = decorator(say_hello)\`.

Now here's where it gets exciting for scientific computing: **JAX's \`@jit\` decorator uses this exact pattern to transform your Python functions into compiled machine code.** When you write:

\`\`\`python
@jax.jit
def my_physics_function(x):
    return complex_computation(x)
\`\`\`

JAX traces your function, optimizes it, and compiles it to run on XLA (the same backend that powers TensorFlow and TPUs). The first call is slow (compilation), but subsequent calls are *blazingly* fast. We're talking 10x-1000x speedups.

This is one of the two superpowers that make JAX perfect for PINNs. The other? You'll see it in the vmap section.`,
  },
  {
    id: 'slicing',
    title: 'Array Slicing',
    description: 'Extract portions of arrays with intuitive syntax.',
    code: `arr = [1, 2, 3, 4, 5]

print(f"Original: {arr}")
print(f"arr[:3]  = {arr[:3]}")   # First 3
print(f"arr[2:4] = {arr[2:4]}")  # Index 2 to 3
print(f"arr[:-1] = {arr[:-1]}")  # All but last
print(f"arr[-1]  = {arr[-1]}")   # Last element`,
    explanation: `Slicing is how you surgically extract pieces of arrays. The syntax \`arr[start:end]\` gives you elements from \`start\` up to (but not including) \`end\`.

The clever bits:
- **Omit start** (\`arr[:3]\`): Start from the beginning
- **Omit end** (\`arr[2:]\`): Go all the way to the end
- **Negative indices** (\`arr[-1]\`): Count from the end (-1 is the last element)
- **Negative in slices** (\`arr[:-1]\`): Everything except the last element

Why does this matter for physics? Because you're constantly working with time series data. "Give me all positions except the last" (for computing differences). "Give me the first N timesteps" (for training). "Give me every other element" (downsampling).

These operations are *free* in NumPy and JAX — they don't copy data, they just create a view. That's crucial when you're working with gigabytes of simulation data.`,
  },
  {
    id: 'random',
    title: 'Random Keys in JAX',
    description: 'JAX requires explicit random state management for reproducibility.',
    code: `# Create a PRNG key
key = jax.random.PRNGKey(42)
print(f"Initial key: {key}")

# Split the key for multiple uses
key, subkey1, subkey2 = jax.random.split(key, 3)

# Generate random numbers
rand1 = jax.random.normal(subkey1, shape=(3,))
rand2 = jax.random.uniform(subkey2, shape=(3,))

print(f"\\nNormal samples: {rand1}")
print(f"Uniform samples: {rand2}")`,
    explanation: `This is where JAX gets opinionated — and for good reason.

In NumPy, you call \`np.random.randn()\` and get random numbers. Simple. But there's hidden global state being mutated every time. That's fine for scripts, but it's *poison* for reproducibility and parallelization.

JAX takes a different approach: **explicit random state**. You create a key, and you must split it before each use. It feels verbose at first, but it guarantees:

1. **Reproducibility**: Same key = same numbers. Always. Even across machines.
2. **Parallelization**: No race conditions. Each parallel branch gets its own key.
3. **Debugging**: You can trace exactly where randomness entered your computation.

The pattern is simple: split your key, use the subkeys, never reuse a key. Think of it like a one-time pad in cryptography — each key should be used exactly once.

For neural networks, you'll initialize weights with these keys. For stochastic simulations, you'll sample noise. The discipline of explicit keys pays off when your code needs to run on TPU pods or when you're debugging why your physics simulation diverged.`,
  },
  {
    id: 'vmap',
    title: 'Vectorized Mapping (vmap)',
    description: 'Transform scalar functions into batch operations — without loops.',
    code: `# Function that computes norm of a 2D vector
def vec_norm(vec):
    x, y = vec[0], vec[1]
    return jnp.square(x) + jnp.square(y)

# Create 10000 unit vectors
theta = jnp.linspace(0, jnp.pi, 10000)
vecs = jnp.stack([jnp.cos(theta), jnp.sin(theta)], axis=1)

# Method 1: List comprehension (slow!)
start = time.time()
norms_loop = [vec_norm(v) for v in vecs]
time_loop = time.time() - start

# Method 2: vmap (fast!)
start = time.time()
norms_vmap = jax.vmap(vec_norm)(vecs)
time_vmap = time.time() - start

print(f"Loop time: {time_loop:.3f}s")
print(f"vmap time: {time_vmap:.3f}s")
print(f"Speedup: {time_loop/time_vmap:.1f}x")`,
    explanation: `**This is JAX's second superpower.** And honestly? It might be the more important one.

Watch the timing. The loop takes 30+ seconds. vmap takes a fraction of a second. That's not a 2x speedup — that's **100-200x faster**.

Here's the magic: \`vmap\` takes a function designed for a *single* input and automatically vectorizes it across a *batch* of inputs. You write simple, readable code for one vector, and vmap handles the parallelization.

This changes how you think about programming. Instead of:
- "How do I write an efficient batched version of this function?"

You think:
- "How does this work for a single example? Great, now \`vmap\` it."

For PINNs, this is transformative. You write physics for one point in space-time. Then you vmap across your entire collocation domain. You differentiate at one point. Then you vmap across all points. The code stays clean and mathematical while running at compiled speeds.

Combined with \`@jit\`, you have a two-step recipe for fast physics code:
1. Write it simply for single inputs
2. vmap for batches, jit for compilation

That's the JAX way.`,
  },
  {
    id: 'autodiff',
    title: 'Automatic Differentiation',
    description: 'Compute exact derivatives — the foundation of gradient-based learning.',
    code: `# Position vector: r(t) = [t, t²]
# Velocity should be: v(t) = [1, 2t]

dr_dt = jax.jacrev(lambda t: jnp.array([t, jnp.square(t)]))

# Test at t = 0, 1, 2
for t in [0.0, 1.0, 2.0]:
    velocity = dr_dt(t)
    print(f"t = {t}: velocity = {velocity}")
    print(f"   Expected: [1, {2*t}]")`,
    explanation: `This is where everything comes together. This is why JAX exists. This is the heart of Physics-Informed Neural Networks.

We define a position vector: \`r(t) = [t, t²]\`. Physically, this is something moving at constant velocity in x and accelerating in y. The velocity should be \`v(t) = dr/dt = [1, 2t]\`.

\`jax.jacrev\` computes this derivative *automatically*. Not numerically (no finite differences). Not symbolically (no computer algebra). **Automatically** — by tracing the computation and applying the chain rule exactly.

Notice how we use \`jacrev\` instead of \`grad\`:
- \`grad\`: For scalar-valued functions (like loss functions)
- \`jacrev\`: For vector-valued functions (like position → velocity)

The "rev" stands for reverse-mode autodiff. There's also \`jacfwd\` (forward-mode). The efficiency rule: **reverse mode is faster when you have many inputs and few outputs** (like a neural network's loss — millions of parameters, one loss value). **Forward mode is faster when you have few inputs and many outputs** (like our example — one time value, two position components). In practice, both work fine for small problems, and JAX handles the complexity for you.

Now imagine: you represent your physics solution with a neural network. Position becomes \`nn(t)\`. You can still call \`jacrev\` to get velocity. The derivative flows through the entire network. And you can vmap this across thousands of time points. And jit-compile the whole thing.

That's how PINNs enforce physics: by differentiating neural networks and penalizing violations of differential equations. JAX makes this not just possible, but *elegant*.`,
  },
  {
    id: 'oop',
    title: 'OOP for Physics Simulations',
    description: 'Structure your code with classes for reusable, modular physics.',
    code: `class TimeStep:
    def __init__(self, position, velocity):
        self.position = position
        self.velocity = velocity
        self.dt = 0.01

    def move(self):
        new_x = self.position[0] + self.velocity[0] * self.dt
        new_y = self.position[1] + self.velocity[1] * self.dt
        self.position = (new_x, new_y)

class Motion(TimeStep):
    def __init__(self, position, velocity):
        super().__init__(position, velocity)

    def compute_trajectory(self, tf):
        vx = 1.0
        t = 0.0
        while t < tf:
            self.move()
            t += self.dt
            vy = 2 * t
            self.velocity = (vx, vy)

    def __call__(self, tf):
        self.compute_trajectory(tf)
        return self.position

# Simulate projectile motion
projectile = Motion(position=(0.0, 0.0), velocity=(1.0, 0.0))
final_pos = projectile(tf=2.0)
print(f"Position after 2 seconds: ({final_pos[0]:.2f}, {final_pos[1]:.2f})")`,
    explanation: `Classes are blueprints. Objects are the things built from those blueprints.

Think about it: an architect draws one blueprint, but you can build a hundred houses from it. Each house is its own thing — different furniture, different people living inside — but they all share the same structure. That's exactly what classes and objects are. \`TimeStep\` is the blueprint. When you write \`Motion(position=(0,0), velocity=(1,0))\`, you're building a house from that blueprint.

But what does the blueprint actually *specify*? Two things: **what data lives inside** (position, velocity, dt) and **what the object can do** (move). An object is just a container that bundles data and functions together. Instead of having loose variables and separate functions floating around, you package them into one neat unit.

**What is \`self\`?** When you write \`self.position\`, you're saying "the position that belongs to *this particular object*." If you build two houses from the same blueprint, each has its own kitchen. \`self\` is how each object refers to its own stuff. Think of it as the object saying "my position" versus "your position."

**What is \`__init__\`?** This is the construction crew. When you write \`Motion(position=(0,0), velocity=(1,0))\`, Python creates an empty container and then calls \`__init__\` to fill it with initial data. It's the setup function — "when this object is born, here's what should be inside it."

**What is inheritance?** Notice \`class Motion(TimeStep)\`. This means Motion *starts with everything TimeStep already has*. It's like a blueprint that says "start with the basic house design, then add a second floor." Motion objects automatically have \`move()\`, \`position\`, \`velocity\`, and \`dt\` without redefining them. You only write the new stuff. \`super().__init__()\` means "build the basic house first, then I'll add my extensions."

**What is \`__call__\`?** This is a neat trick. Normally you call functions: \`f(x)\`. But what if you want to call an *object* like a function? Define \`__call__\`, and suddenly \`projectile(tf=2.0)\` works. The object becomes callable. This is everywhere in deep learning — PyTorch models use it so you can write \`model(x)\` instead of \`model.forward(x)\`.

**Why bother?** Because physics simulations have *state* that evolves. A projectile has position and velocity that change over time. OOP lets you bundle that state with the rules for how it changes. Create a projectile, call methods on it, and it updates itself. Clean. Intuitive. Matches how we think about physical objects.`,
  },
]

function CollapsibleSection({ section, index, isOpen, onToggle, kernelReady, onRunCode }) {
  const [code, setCode] = useState(section.code)
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const isModified = code !== section.code

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
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mb-4">
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
              <pre className={`text-sm font-mono whitespace-pre-wrap ${output?.error ? 'text-red-300' : 'text-gray-300'}`}>
                {output?.error || output?.text || '(no output)'}
              </pre>
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

          {/* Insights */}
          {section.insights && (
            <div className="p-5 bg-neutral-900/50 border-t border-neutral-800">
              <div className="text-accent text-xs font-semibold uppercase tracking-wider mb-3">
                Key Insights
              </div>
              <ul className="space-y-2">
                {section.insights.map((insight, i) => (
                  <li key={i} className="flex gap-3 text-dark-muted text-sm">
                    <span className="text-accent">→</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function JaxTutorial() {
  const [openSections, setOpenSections] = useState({})
  const [kernelStatus, setKernelStatus] = useState('idle') // idle, building, launching, connecting, ready, error
  const [statusMessage, setStatusMessage] = useState('')
  const [kernelReady, setKernelReady] = useState(false)
  const [setupStatus, setSetupStatus] = useState({ install: 'pending', imports: 'pending' }) // pending, running, done, error
  const kernelRef = useRef(null)
  const mountedRef = useRef(true)

  // Connect to Binder
  const connect = useCallback(() => {
    setKernelStatus('building')
    setStatusMessage('Connecting to Binder...')
    setKernelReady(false)
    kernelRef.current = null
    connectDirectToBinder(mountedRef.current, setKernelStatus, setStatusMessage, setKernelReady, kernelRef)
  }, [])

  // Connect to Binder on mount
  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => { mountedRef.current = false }
  }, [connect])

  // Run code on kernel
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
          // Ignore parse errors for non-JSON messages
        }
      }

      kernel.addEventListener('message', handler)
      kernel.send(JSON.stringify(msg))

      // Timeout
      setTimeout(() => {
        if (!done) {
          kernel.removeEventListener('message', handler)
          reject(new Error('Execution timed out'))
        }
      }, 60000)
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
              <span>🚀</span>
              <span>Interactive Tutorial</span>
            </div>
            <h1>JAX for Scientific ML</h1>
            <p className="text-dark-muted text-lg">
              Master the Python concepts that power Physics-Informed Neural Networks.
              <strong className="text-white"> Run code live in your browser.</strong>
            </p>
          </section>

          {/* YouTube Video */}
          <section className="mb-8">
            <div className="aspect-video rounded-xl overflow-hidden border border-neutral-800">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/H1h0wJVnFJk"
                title="JAX for Scientific ML Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </section>

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

          {/* Setup section - Install JAX then import */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-neutral-800">
              <h3 className="text-white font-semibold">Setup: Install & Import JAX</h3>
              <p className="text-dark-muted text-sm mt-1">Run both cells below in order. Installation takes ~30 seconds.</p>
            </div>

            {/* Step 1: Install */}
            <div className="border-b border-neutral-800">
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <span className="text-dark-subtle text-xs font-mono uppercase tracking-wider">
                    Step 1: Install JAX
                  </span>
                  {setupStatus.install === 'done' && <span className="text-green-500 text-xs">✓</span>}
                  {setupStatus.install === 'running' && <span className="text-yellow-500 text-xs animate-spin">⟳</span>}
                  {setupStatus.install === 'error' && <span className="text-red-500 text-xs">✗</span>}
                </div>
                <button
                  onClick={async () => {
                    setSetupStatus(s => ({ ...s, install: 'running' }))
                    try {
                      await runCode('import subprocess\nsubprocess.check_call(["pip", "install", "-q", "jax", "jaxlib"])\nprint("JAX installed successfully!")')
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
                <code className="text-sm text-dark-muted font-mono">pip install jax jaxlib</code>
              </pre>
            </div>

            {/* Step 2: Import */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22]">
                <div className="flex items-center gap-2">
                  <span className="text-dark-subtle text-xs font-mono uppercase tracking-wider">
                    Step 2: Import Libraries
                  </span>
                  {setupStatus.imports === 'done' && <span className="text-green-500 text-xs">✓</span>}
                  {setupStatus.imports === 'running' && <span className="text-yellow-500 text-xs animate-spin">⟳</span>}
                  {setupStatus.imports === 'error' && <span className="text-red-500 text-xs">✗</span>}
                </div>
                <button
                  onClick={async () => {
                    setSetupStatus(s => ({ ...s, imports: 'running' }))
                    try {
                      await runCode('import jax\nimport jax.numpy as jnp\nimport time\nprint(f"JAX version: {jax.__version__}")\nprint("All imports loaded!")')
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
                  {setupStatus.imports === 'running' ? '⟳ Importing...' : setupStatus.imports === 'done' ? '✓ Imported' : '▶ Import'}
                </button>
              </div>
              <pre className="!bg-[#0d1117] !m-0 p-4 overflow-x-auto">
                <code className="text-sm text-dark-muted font-mono">import jax{'\n'}import jax.numpy as jnp{'\n'}import time</code>
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
            <CollapsibleSection
              key={section.id}
              section={section}
              index={index}
              isOpen={openSections[section.id]}
              onToggle={() => toggleSection(section.id)}
              kernelReady={kernelReady}
              onRunCode={runCode}
            />
          ))}
        </div>
      </section>
    </Layout>
  )
}
