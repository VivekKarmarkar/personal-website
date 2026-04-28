import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CVNNs from './pages/CVNNs'
import QuatPINNs from './pages/QuatPINNs'
import TeachingPINNs from './pages/TeachingPINNs'
import Lectures from './pages/teaching-pinns/Lectures'
import LecturePage from './pages/teaching-pinns/LecturePage'
import Tutorials from './pages/teaching-pinns/Tutorials'
import TutorialPage from './pages/teaching-pinns/TutorialPage'
import Perspectives from './pages/teaching-pinns/Perspectives'
import PerspectivePage from './pages/teaching-pinns/PerspectivePage'
import InteractiveSims from './pages/InteractiveSims'
import EarnshawTheorem from './pages/sims/EarnshawTheorem'
import ProjectileMotion from './pages/sims/ProjectileMotion'
import MatrixTransforms from './pages/sims/MatrixTransforms'
import NeuralNetLego from './pages/sims/NeuralNetLego'
import ElectromagneticGenerator from './pages/sims/ElectromagneticGenerator'
import SequenceConvergence from './pages/sims/SequenceConvergence'
import FeynmanConservation from './pages/sims/FeynmanConservation'
import Wonyp from './pages/Wonyp'
import DancerClaude from './pages/DancerClaude'
import ProfessorClaude from './pages/ProfessorClaude'
import SunoSongs from './pages/SunoSongs'
import VeritasBluePi from './pages/VeritasBluePi'
import ImuLe from './pages/ImuLe'
import GolfModeling from './pages/GolfModeling'
import PctPt from './pages/PctPt'
import TrackMan from './pages/TrackMan'
import VisualizationTools from './pages/VisualizationTools'
import PatScan from './pages/PatScan'
import ClaudeCodeOS from './pages/ClaudeCodeOS'
import VmClaude from './pages/VmClaude'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cvnns" element={<CVNNs />} />
        <Route path="/quat-pinns" element={<QuatPINNs />} />
        <Route path="/teaching-pinns" element={<TeachingPINNs />} />
        <Route path="/teaching-pinns/lectures" element={<Lectures />} />
        <Route path="/teaching-pinns/lectures/:lectureId" element={<LecturePage />} />
        <Route path="/teaching-pinns/tutorials" element={<Tutorials />} />
        <Route path="/teaching-pinns/tutorials/:tutorialId" element={<TutorialPage />} />
        <Route path="/teaching-pinns/perspectives" element={<Perspectives />} />
        <Route path="/teaching-pinns/perspectives/:perspectiveId" element={<PerspectivePage />} />
        <Route path="/interactive-sims" element={<InteractiveSims />} />
        <Route path="/sims/earnshaw-theorem" element={<EarnshawTheorem />} />
        <Route path="/sims/projectile-motion" element={<ProjectileMotion />} />
        <Route path="/sims/matrix-transforms" element={<MatrixTransforms />} />
        <Route path="/sims/neural-net-lego" element={<NeuralNetLego />} />
        <Route path="/sims/electromagnetic-generator" element={<ElectromagneticGenerator />} />
        <Route path="/sims/sequence-convergence" element={<SequenceConvergence />} />
        <Route path="/sims/feynman-conservation" element={<FeynmanConservation />} />
        <Route path="/wonyp" element={<Wonyp />} />
        <Route path="/dancer-claude" element={<DancerClaude />} />
        <Route path="/professor-claude" element={<ProfessorClaude />} />
        <Route path="/suno-songs" element={<SunoSongs />} />
        <Route path="/veritas-blue-pi" element={<VeritasBluePi />} />
        <Route path="/imu-le" element={<ImuLe />} />
        <Route path="/golf-modeling" element={<GolfModeling />} />
        <Route path="/pct-pt" element={<PctPt />} />
        <Route path="/trackman" element={<TrackMan />} />
        <Route path="/visualization-tools" element={<VisualizationTools />} />
        <Route path="/pat-scan" element={<PatScan />} />
        <Route path="/claude-code-os" element={<ClaudeCodeOS />} />
        <Route path="/vm-claude" element={<VmClaude />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
