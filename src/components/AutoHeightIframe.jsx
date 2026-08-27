import { useEffect, useRef, useState } from 'react'

// Same-origin iframe that sizes itself to its content's real height.
// Fixes the fixed-height + scrolling="no" failure: content cut on phones,
// dead space on laptop split (combined Codex/relay review, fix item 1).
//
// Measurement is direct (same-origin contentDocument) with a ResizeObserver
// on the inner document plus window resize/orientation listeners. The 2px
// dead-band stops measure->set->reflow feedback loops (the failure mode that
// sank the earlier onLoad auto-resize attempt, commit d8ac629).
export default function AutoHeightIframe({ src, title, initialHeight = 3000 }) {
  const iframeRef = useRef(null)
  const [height, setHeight] = useState(initialHeight)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    let observer = null
    let rafId = null

    const measure = () => {
      rafId = null
      try {
        const doc = iframe.contentDocument
        if (!doc || !doc.body) return
        // body rect bottom is viewport-independent (documentElement.scrollHeight
        // floors at the iframe height, so it can grow but never shrink back)
        const h = Math.ceil(doc.body.getBoundingClientRect().bottom) + 16
        if (h > 32) {
          setHeight(prev => (Math.abs(prev - h) > 2 ? h : prev))
        }
      } catch {
        /* document not ready — the next event re-measures */
      }
    }
    const scheduleMeasure = () => {
      if (rafId == null) rafId = requestAnimationFrame(measure)
    }

    const attach = () => {
      scheduleMeasure()
      try {
        const doc = iframe.contentDocument
        if (doc && typeof ResizeObserver !== 'undefined') {
          if (observer) observer.disconnect()
          observer = new ResizeObserver(scheduleMeasure)
          observer.observe(doc.documentElement)
          if (doc.body) observer.observe(doc.body)
        }
      } catch {
        /* fall back to window listeners only */
      }
    }

    iframe.addEventListener('load', attach)
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') attach()
    // Early re-attach: until the inner 'load' event fires (it waits on slow
    // subresources, e.g. the VOYP page's YouTube embed) the observer may still
    // be bound to the interstitial about:blank document, leaving the height
    // stale. Re-attach on a short interval so the real document is observed
    // as soon as it exists; stop once it is fully loaded (or after ~10s).
    let ticks = 0
    const early = setInterval(() => {
      attach()
      ticks += 1
      let done = false
      try {
        const doc = iframe.contentDocument
        done = !!(doc && doc.readyState === 'complete')
      } catch {
        /* keep polling */
      }
      if (done || ticks >= 20) clearInterval(early)
    }, 500)
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('orientationchange', scheduleMeasure)

    return () => {
      clearInterval(early)
      iframe.removeEventListener('load', attach)
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('orientationchange', scheduleMeasure)
      if (observer) observer.disconnect()
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      scrolling="no"
      className="w-full border-none block"
      style={{ height: `${height}px`, background: '#0a0a0a' }}
    />
  )
}
