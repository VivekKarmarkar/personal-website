// Site-standard resolution guidance layer — DEVICE-FIRST detection (Vivek's logic):
//
//   1. Figure out the device, then the resolution.
//   2. PHONE (coarse pointer): the only possible suggestion is landscape.
//        portrait  -> "rotate to landscape" (site orange banner)
//        landscape -> nothing (a phone cannot go fullscreen)
//   3. LAPTOP (fine pointer): the only possible suggestion is fullscreen.
//        split screen (< 1024px window) -> "USE FULLSCREEN MODE" (Feynman-sim amber)
//        full screen -> nothing
//
// Exactly one notice — or none — is ever visible. Pure CSS via pointer/orientation
// media queries; no JS, no UA sniffing.
export default function ResolutionNotice() {
  return (
    <>
      <style>{`
        .rn-rotate, .rn-fullscreen { display: none; }
        /* Phone in portrait -> suggest landscape */
        @media (pointer: coarse) and (orientation: portrait) {
          .rn-rotate { display: block; }
        }
        /* Laptop in a split/narrow window -> suggest fullscreen */
        @media (pointer: fine) and (max-width: 1023px) {
          .rn-fullscreen { display: block; }
        }
      `}</style>

      {/* Phone portrait: rotate to landscape */}
      <div
        className="rn-rotate mb-6 rounded-lg px-4 py-3 text-sm text-center"
        style={{ backgroundColor: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }}
      >
        For the best experience on phone, rotate to <strong>landscape view</strong>
      </div>

      {/* Laptop split screen: use fullscreen (Feynman-sim amber, verbatim colors/text) */}
      <div
        className="rn-fullscreen mb-6 rounded-lg px-4 py-3 text-center"
        style={{ backgroundColor: '#78350f' }}
      >
        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.05em' }}>
          USE FULLSCREEN MODE FOR BEST EXPERIENCE
        </span>
      </div>
    </>
  )
}
