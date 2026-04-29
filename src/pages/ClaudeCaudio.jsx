import { useState, useRef } from 'react'
import Layout from '../components/Layout'

const lessons = [
  {
    id: 'how-claude-code-works',
    title: 'How Claude Code Works',
    description: 'The mental model — what happens when you type a message, how the agent loop works, and why Claude Code feels different from a chatbot.',
    filename: 'how_claude_code_works_lesson.mp3',
    number: 1,
  },
  {
    id: 'extend-claude-code',
    title: 'Extending Claude Code',
    description: 'Slash commands, custom skills, MCP servers, hooks — the extension points that turn Claude Code from a tool into an operating system.',
    filename: 'extend_claude_code_lesson.mp3',
    number: 2,
  },
  {
    id: 'explore-claude-directory',
    title: 'The .claude Directory',
    description: 'Where Claude Code stores its memory, settings, and project context. CLAUDE.md files, permissions, and how the directory structure shapes behavior.',
    filename: 'explore_claude_directory_lesson.mp3',
    number: 3,
  },
  {
    id: 'explore-context-window',
    title: 'The Context Window',
    description: 'How the context window fills up, what gets compressed, why long conversations drift, and strategies for managing context effectively.',
    filename: 'explore_context_window_lesson.mp3',
    number: 4,
  },
]

function LessonCard({ lesson, isPlaying, isActive, onPlay, onPause, onStop, onSeek, currentTime, duration, audioBasePath }) {
  const progressRef = useRef(null)

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    onSeek(percentage * duration)
  }

  return (
    <div
      className={`bg-neutral-900 rounded-lg border transition-all ${
        isActive ? 'border-[#6CBE45]' : 'border-neutral-800'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
            style={{ backgroundColor: '#6CBE45' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {isActive && (
            <button
              onClick={onStop}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 bg-neutral-700 hover:bg-neutral-600"
              title="Stop"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            </button>
          )}

          <a
            href={`${audioBasePath}${lesson.filename}`}
            download={lesson.filename}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 bg-neutral-700 hover:bg-neutral-600"
            title="Download"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
            </svg>
          </a>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-dark-muted text-sm font-mono">0{lesson.number}</span>
              <span>{lesson.title}</span>
            </h3>
            <p className="mt-2 text-sm text-dark-muted leading-relaxed">
              {lesson.description}
            </p>
          </div>
        </div>

        {isActive && (
          <div className="mt-4">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-2 bg-neutral-700 rounded-full overflow-hidden cursor-pointer group"
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: '#6CBE45',
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-dark-muted">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ClaudeCaudio() {
  const [currentLesson, setCurrentLesson] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const playLesson = (lesson) => {
    const audioPath = `/claude-caudio/modules/core-concepts/${lesson.filename}`

    if (currentLesson?.id === lesson.id && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setCurrentLesson(lesson)
      setCurrentTime(0)
      setDuration(0)

      const audio = new Audio(audioPath)
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      audio.play().catch(err => console.error('Play error:', err))
      setIsPlaying(true)
    }
  }

  const pauseLesson = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const stopLesson = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setCurrentLesson(null)
  }

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <Layout>
      <article className="w-full py-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Train Badges */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: '#6CBE45' }}
                >
                  E
                </span>
                <span className="text-dark-muted">Education</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-black text-lg font-bold"
                  style={{ backgroundColor: '#A7A9AC' }}
                >
                  I
                </span>
                <span className="text-dark-muted">Claude Code Borough Local on AI Island</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Claude Caudio</h1>
            <p className="text-dark-muted text-lg">
              Claude Code docs you can listen to on a walk.
            </p>
          </section>

          {/* Motivation */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">The Problem</h2>
            <p className="text-dark-muted leading-relaxed mb-4">
              Keeping up with Claude Code is exhausting. The ecosystem is a firehose — team members tweeting frantically about every new feature, webinars that are hit or miss, and official docs that are technically correct but too terse to actually enjoy reading. If you're trying to learn Claude Code while walking and remote-controlling from your phone, reading dense documentation isn't an option.
            </p>

            <h2 className="text-xl font-semibold mb-6 mt-8">What I Actually Believe</h2>
            <p className="text-dark-muted leading-relaxed mb-4">
              I don't think traditional educational content works for Claude Code. I learned by building — and the most effective "lesson" I ever gave was asking my PhD advisor to pick a real problem and solve it with Claude Code on my laptop. He felt empowered immediately. One-on-one, problem-first, learning by doing.
            </p>
            <p className="text-dark-muted leading-relaxed mb-4">
              But building leaves blind spots. You learn the parts you use and miss everything else. The official docs fill those gaps — if you can get through them.
            </p>

            <h2 className="text-xl font-semibold mb-6 mt-8">The Solution</h2>
            <p className="text-dark-muted leading-relaxed mb-4">
              I took the official Claude Code documentation, gave Claude skills to generate audio, and had it create personalized audio lessons from the doc pages — tailored to how I think, at a pace that works for walking. Then I listened to them while walking, and if I feel compelled to try out an item I just learnt about, I try it out right then in the Claude app via remote-control.
            </p>
            <p className="text-dark-muted leading-relaxed">
              These are those lessons. Docs you can listen to on a walk.
            </p>
          </section>

          {/* Module: Core Concepts */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-dark-muted">MODULE 01</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Core Concepts</h2>
            <p className="text-dark-muted mb-8">
              The foundational mental models — how Claude Code works, where it stores things, how context flows, and how to extend it.
            </p>

            <div className="space-y-4">
              {lessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isPlaying={currentLesson?.id === lesson.id && isPlaying}
                  isActive={currentLesson?.id === lesson.id}
                  onPlay={() => playLesson(lesson)}
                  onPause={pauseLesson}
                  onStop={stopLesson}
                  onSeek={seekTo}
                  currentTime={currentLesson?.id === lesson.id ? currentTime : 0}
                  duration={currentLesson?.id === lesson.id ? duration : 0}
                  audioBasePath="/claude-caudio/modules/core-concepts/"
                />
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-dark-muted text-sm">
              Audio generated from the{' '}
              <a
                href="https://docs.anthropic.com/en/docs/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ color: '#6CBE45' }}
              >
                official Claude Code documentation
              </a>
              , personalized and narrated by Claude.
            </p>
          </footer>

        </div>
      </article>
    </Layout>
  )
}
