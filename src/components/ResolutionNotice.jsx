// Site-standard resolution guidance layer.
//
// Behavior modeled on the exhaustively-tested Feynman Conservation game notice
// (amber "USE FULLSCREEN MODE" hidden at >=1024px) composed with the site-standard
// rotate-to-landscape banner (ClaudeCodeOS/RCP/ClaudeCodeLM idiom):
//   <  640px  -> orange: rotate phone to landscape
//   640-1023  -> amber:  use fullscreen mode (laptop split screen)
//   >= 1024px -> nothing
// Exactly one notice is visible at a time.
export default function ResolutionNotice() {
  return (
    <>
      {/* Phone portrait: rotate to landscape */}
      <div
        className="mb-6 rounded-lg px-4 py-3 text-sm text-center sm:hidden"
        style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}
      >
        For the best experience on phone, rotate to <strong>landscape view</strong>
      </div>

      {/* Laptop split screen: use fullscreen (Feynman-sim amber, verbatim colors/text) */}
      <div
        className="mb-6 rounded-lg px-4 py-3 text-center hidden sm:block lg:hidden"
        style={{ backgroundColor: '#78350f' }}
      >
        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
          USE FULLSCREEN MODE FOR BEST EXPERIENCE
        </span>
      </div>
    </>
  )
}
