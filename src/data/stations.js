// Station positions from AI Island (0) to Physics Island (100)
export const stations = {
  'suno-songs': {
    id: 'suno-songs',
    name: 'Suno Songs',
    position: 5, // very near AI
    description: 'AI-generated music',
    url: '/suno-songs',
  },
  'sora-videos': {
    id: 'sora-videos',
    name: 'SORA Videos',
    position: 8, // very near AI
    description: 'AI-generated videos',
  },
  'veritas-blue-pi': {
    id: 'veritas-blue-pi',
    name: 'Veritas^(Blue*Pi)',
    position: 20, // near AI
    description: 'AI Physics Teacher fusing Veritasium + 3Blue1Brown',
    url: '/veritas-blue-pi',
  },
  'quat-pinns': {
    id: 'quat-pinns',
    name: 'Quat-PINNs',
    fullName: 'Quaternionic Physics-Informed Neural Networks',
    position: 40, // AI-middle
    description: 'When complex numbers aren\'t complex enough',
    url: '/quat-pinns',
  },
  'teaching-pinns': {
    id: 'teaching-pinns',
    name: 'Teaching PINNs',
    position: 50, // middle
    description: 'Triple interchange - all lines meet here',
    url: '/teaching-pinns',
  },
  'pat-scan': {
    id: 'pat-scan',
    name: 'PAT Scan',
    fullName: 'Palpation-Assisted Tomography',
    position: 65, // middle-Physics
    description: 'Palpation-Assisted Tomography - AI that sees through touch',
    url: '/pat-scan',
  },
  'interactive-sims': {
    id: 'interactive-sims',
    name: 'Interactive Sims',
    position: 80, // near Physics
    description: 'Interactive physics simulations',
    url: '/interactive-sims',
  },
  'cvnns': {
    id: 'cvnns',
    name: 'CVNNs',
    fullName: 'Complex-valued Neural Networks',
    position: 90, // near Physics
    description: 'When real numbers aren\'t real enough',
    url: '/cvnns',
  },
  'wonyp': {
    id: 'wonyp',
    name: 'WONYP',
    fullName: "What's on your Plate?",
    position: 10,
    description: 'LLM-driven Indian Food Analysis',
    url: '/wonyp',
  },
  'gpt-bhojan': {
    id: 'gpt-bhojan',
    name: 'GPT-Bhojan',
    position: 20,
    description: 'LLM-augmented Indian Food Classification',
  },
  'claude-code-lm': {
    id: 'claude-code-lm',
    name: 'ClaudeCodeLM',
    position: 50,
    description: 'Paper podcasts on demand — built in-house when NotebookLM said no',
    url: '/claude-code-lm',
  },
  'dancer-claude': {
    id: 'dancer-claude',
    name: 'Dancer Claude',
    position: 30,
    description: 'A stick figure that dances to music — three ways',
    url: '/dancer-claude',
  },
  'professor-claude': {
    id: 'professor-claude',
    name: 'Professor Claude',
    position: 40,
    description: 'A Robot Teacher just for you',
    url: '/professor-claude',
  },
  'claude-code-os': {
    id: 'claude-code-os',
    name: 'Claude Code OS',
    position: 10,
    description: 'Treating Claude Code as an operating system',
    url: '/claude-code-os',
  },
  'rcp': {
    id: 'rcp',
    name: 'RCP',
    fullName: 'Remote Control Protocol',
    position: 20,
    description: 'A protocol for remote-controlling Claude Code',
    url: '/rcp',
  },
  'vm-claude': {
    id: 'vm-claude',
    name: 'VM Claude',
    position: 40,
    description: 'A virtual machine concept for Claude',
    url: '/vm-claude',
  },
  'claude-caudio': {
    id: 'claude-caudio',
    name: 'Claude Caudio',
    position: 35,
    description: 'Claude Code docs you can listen to on a walk',
    url: '/claude-caudio',
  },
  'codeguide': {
    id: 'codeguide',
    name: 'Codeguide',
    position: 50,
    description: 'Guided code walkthroughs with Claude',
  },
  'agentic-algorithm-discovery': {
    id: 'agentic-algorithm-discovery',
    name: 'AAD',
    fullName: 'Agentic Algorithm Discovery',
    position: 50, // W-line express stop — essays cut across every island
    description: 'The case for letting AI agents discover the algorithms',
    url: '/agentic-algorithm-discovery',
  },
  'imu-le': {
    id: 'imu-le',
    name: 'IMU-LE',
    fullName: 'Lyapunov Exponents from IMU data',
    position: 50, // Physics-Sports
    description: 'Chaos analysis from motion sensors',
    url: '/imu-le',
  },
  'golf-modeling': {
    id: 'golf-modeling',
    name: 'Golf Modeling',
    position: 60, // Physics-Sports
    description: 'Physics-based golf swing analysis',
    url: '/golf-modeling',
  },
  'pct-pt': {
    id: 'pct-pt',
    name: 'PCT-PT',
    fullName: 'Point Cluster Technique with Perturbation Theory',
    position: 75, // toward Sports
    description: 'Biomechanical motion analysis',
    url: '/pct-pt',
  },
  'trackman': {
    id: 'trackman',
    name: 'TM',
    fullName: 'TrackMan Experience',
    position: 90, // near Sports
    description: 'Ball flight tracking and analysis',
    url: '/trackman',
  },
  'visualization-tools': {
    id: 'visualization-tools',
    name: 'VT',
    fullName: 'Visualization Tools',
    position: 95, // near Sports
    description: 'Tools for visualizing biomechanical data',
    url: '/visualization-tools',
  },
  'normal-running': {
    id: 'normal-running',
    name: 'NR',
    fullName: 'Normal Running',
    position: 10, // Fun Island
    description: 'Road and trail running',
  },
  'ultra-running': {
    id: 'ultra-running',
    name: 'UR',
    fullName: 'Ultra Running',
    position: 30, // Fun Island
    description: 'Long distance trail adventures',
  },
  'bouldering': {
    id: 'bouldering',
    name: 'BD',
    fullName: 'Bouldering',
    position: 50, // Fun Island
    description: 'Climbing without ropes',
  },
  'cricket': {
    id: 'cricket',
    name: 'CK',
    fullName: 'Cricket',
    position: 70, // Fun Island
    description: 'The gentleman\'s game',
  },
};

export const stationOrder = [
  'suno-songs',
  'sora-videos',
  'atomic-prompting',
  'veritas-blue-pi',
  'quat-pinns',
  'teaching-pinns',
  'pat-scan',
  'interactive-sims',
  'cvnns',
];
