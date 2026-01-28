import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import { sunoSongs } from '../data/sunoSongs'

function SongCard({ song, isPlaying, isActive, onPlay, onPause, onStop, onSeek, currentTime, duration }) {
  const [showLyrics, setShowLyrics] = useState(false)
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
    const newTime = percentage * duration
    onSeek(newTime)
  }

  return (
    <div
      className={`bg-neutral-900 rounded-lg border transition-all ${
        isActive ? 'border-[#7C3AED]' : 'border-neutral-800'
      }`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Play/Pause button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
            style={{ backgroundColor: '#7C3AED' }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Stop button (only when active) */}
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

          {/* Title and style */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>{song.emoji}</span>
              <span>{song.title}</span>
            </h3>
            {song.titleEnglish && (
              <p className="text-dark-muted text-sm">{song.titleEnglish}</p>
            )}
            {song.subtitle && (
              <p className="text-dark-muted text-sm">{song.subtitle}</p>
            )}
            <span
              className="inline-block mt-2 text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA' }}
            >
              {song.style}
            </span>
          </div>
        </div>

        {/* Progress bar (only when active) */}
        {isActive && (
          <div className="mt-4">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-2 bg-neutral-700 rounded-full overflow-hidden cursor-pointer group"
            >
              <div
                className="h-full rounded-full transition-all group-hover:bg-[#9F7AEA]"
                style={{
                  backgroundColor: '#7C3AED',
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

        {/* Description */}
        <p className="mt-4 text-sm text-dark-muted leading-relaxed">
          {song.description}
        </p>
      </div>

      {/* Lyrics toggle */}
      <div className="border-t border-neutral-800">
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className="w-full px-5 py-3 text-left text-sm font-medium flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
        >
          <span style={{ color: '#A78BFA' }}>
            {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${showLyrics ? 'rotate-180' : ''}`}
            style={{ color: '#A78BFA' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showLyrics && (
          <div className="px-5 pb-5">
            <pre className="text-sm text-dark-muted whitespace-pre-wrap font-sans leading-relaxed">
              {song.lyrics}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SunoSongs() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  const playSong = (song) => {
    const audioPath = `/generative-art/suno-songs/${song.filename}`

    if (currentSong?.id === song.id && audioRef.current) {
      // Same song - just play
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      // New song - stop current one first
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setCurrentSong(song)
      setCurrentTime(0)
      setDuration(0)

      // Create new audio element
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

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e)
        console.error('Failed to load:', audioPath)
      })

      audio.play().catch(err => {
        console.error('Play error:', err)
      })
      setIsPlaying(true)
    }
  }

  const pauseSong = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setCurrentSong(null)
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

          {/* Header */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: '#7C3AED' }}
              >
                G
              </span>
              <span className="text-dark-muted">Generative Art</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Suno Songs</h1>
            <p className="text-dark-muted text-lg">
              AI-generated music across genres — from rap-rock philosophy to golden era Hindi to Marathi lavani.
            </p>
          </section>

          {/* The Story */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">The Story</h2>

            <p className="text-dark-muted leading-relaxed mb-6">
              Tyler Bell, a GenAI professor, introduced me to Suno. Fun fact: the founder has a physics background. So naturally, I approached it like a physicist would...
            </p>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">🔬</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#A78BFA' }}>Benchmark</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Can this thing reconstruct ground truth? I fed it "Yeh Raat Bheegi Bheegi"—a golden era Hindi classic. Suno caught the copyright. <span className="text-white">Respect.</span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">🔄</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#A78BFA' }}>Transform</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Apply a transformation operator. Same vibe, new words. "Bheegi Bheegi" → <span className="text-white">"Mahki Mahki"</span>. Same trick on a Marathi song → <span className="text-white">"Saadila Nako Dharu"</span>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">✨</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#A78BFA' }}>Go Novel</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Now create something original. <span className="text-white">"Chaand Sa Safar"</span>—a brand new golden era composition. No source material. Pure generation.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="text-2xl">💡</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#A78BFA' }}>The Realization</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    Wait... this thing is giving me <em>whatever experience I want</em>. Tyler had told me to read about Nozick's "Experience Machine." The irony hit different.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 p-4 rounded-lg border" style={{ borderColor: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                <div className="text-2xl">🎸</div>
                <div>
                  <div className="font-medium mb-1" style={{ color: '#A78BFA' }}>The Conclusion</div>
                  <p className="text-dark-muted text-sm leading-relaxed">
                    I'm a Linkin Park / BFMV / Breaking Benjamin / Metallica person. So the only way to end this was a rap-rock thesis statement about the tool itself. <span className="text-white">"The Experience Machine"</span> was born.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Song list */}
          <div className="space-y-6">
            {sunoSongs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id && isPlaying}
                isActive={currentSong?.id === song.id}
                onPlay={() => playSong(song)}
                onPause={pauseSong}
                onStop={stopSong}
                onSeek={seekTo}
                currentTime={currentSong?.id === song.id ? currentTime : 0}
                duration={currentSong?.id === song.id ? duration : 0}
              />
            ))}
          </div>

          {/* Footer note */}
          <footer className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-dark-muted text-sm">
              All tracks generated with{' '}
              <a
                href="https://suno.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ color: '#A78BFA' }}
              >
                Suno AI
              </a>
              . Style descriptions provided by Suno. Lyrics crafted in collaboration with ChatGPT.
            </p>
          </footer>

        </div>
      </article>
    </Layout>
  )
}
