import { useState } from 'react';
import { lines, lineOrder } from '../data/lines';
import { stations } from '../data/stations';

function LineBullet({ line, size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold`}
      style={{ backgroundColor: line.colorHex }}
    >
      <span className="text-white">{line.id}</span>
    </div>
  );
}

function SubwayLineVisual({ line }) {
  const lineStations = line.stations.map(id => stations[id]);
  const totalStations = lineStations.length;

  return (
    <div className="py-8 px-6">
      {/* Direction label */}
      <div className="text-dark-muted text-xs uppercase tracking-wider mb-6">
        {line.direction}
      </div>

      {/* Subway line visualization */}
      <div className="relative">
        {/* The track line with animated train */}
        <div
          className="absolute top-4 left-6 right-6 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: `${line.colorHex}33` }}
        >
          {/* Base track */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: line.colorHex, opacity: 0.4 }}
          />
          {/* Animated train glow */}
          <div
            className="absolute top-0 bottom-0 w-20 rounded-full animate-train"
            style={{
              background: `linear-gradient(90deg, transparent, ${line.colorHex}, ${line.colorHex}, transparent)`,
              boxShadow: `0 0 20px ${line.colorHex}, 0 0 40px ${line.colorHex}`,
            }}
          />
        </div>

        {/* Stations */}
        <div className="relative flex justify-between">
          {lineStations.map((station, index) => (
            <div
              key={station.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / totalStations}%` }}
            >
              {/* Station circle - clickable if has URL */}
              {station.url ? (
                <a
                  href={station.url}
                  className="w-8 h-8 rounded-full border-4 bg-dark-bg cursor-pointer transition-all duration-200 hover:scale-125 relative z-10 block"
                  style={{
                    borderColor: line.colorHex,
                    boxShadow: `0 0 0 2px var(--color-dark-bg)`,
                  }}
                  title={`${station.fullName || station.name}${station.description ? ' - ' + station.description : ''} (Click to explore)`}
                >
                  {/* Inner dot - glows on hover for clickable stations */}
                  <div
                    className="absolute inset-1.5 rounded-full transition-all duration-200"
                    style={{ backgroundColor: line.colorHex, opacity: 0.5 }}
                  />
                </a>
              ) : (
                <div
                  className="w-8 h-8 rounded-full border-4 bg-dark-bg cursor-default transition-all duration-200 hover:scale-110 relative z-10"
                  style={{
                    borderColor: line.colorHex,
                    boxShadow: `0 0 0 2px var(--color-dark-bg)`,
                  }}
                  title={station.fullName || station.name}
                >
                  {/* Inner dot */}
                  <div
                    className="absolute inset-2 rounded-full"
                    style={{ backgroundColor: line.colorHex, opacity: 0.3 }}
                  />
                </div>
              )}

              {/* Station name below */}
              {station.url ? (
                <a
                  href={station.url}
                  className="text-xs text-dark-muted mt-3 text-center leading-tight max-w-24 block hover:text-white transition-colors"
                >
                  {station.name}
                </a>
              ) : (
                <span className="text-xs text-dark-muted mt-3 text-center leading-tight max-w-24 block">
                  {station.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LineRow({ line, isExpanded, onToggle }) {
  const arrivalTime = line.id === 'P' ? 2 : line.id === 'A' ? 5 : 3;

  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 px-5 flex items-center gap-5 hover:bg-neutral-900/50 transition-colors text-left"
      >
        <LineBullet line={line} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">
              {line.fullName}
            </span>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            {line.description}
          </p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div>
            <span className="font-semibold text-lg text-accent">
              {arrivalTime} min
            </span>
          </div>
          <span className="text-dark-muted text-lg">
            {isExpanded ? '−' : '+'}
          </span>
        </div>
      </button>

      {/* Expanded subway line visual */}
      {isExpanded && (
        <div className="bg-neutral-900/30 border-t border-neutral-800">
          <SubwayLineVisual line={line} />
        </div>
      )}
    </div>
  );
}

export default function ArrivalBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedLine, setExpandedLine] = useState(null);

  const handleToggle = (lineId) => {
    setExpandedLine(expandedLine === lineId ? null : lineId);
  };

  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
          {/* Board header - clickable to expand/collapse */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors"
          >
            <h2 className="text-dark-muted text-sm font-medium uppercase tracking-wider">
              Explore My Work
            </h2>
            <span className="text-dark-muted text-xl font-light">
              {isOpen ? '−' : '+'}
            </span>
          </button>

          {/* Lines - only shown when expanded */}
          {isOpen && (
            <div className="border-t border-neutral-800">
              {lineOrder.map((lineId) => (
                <LineRow
                  key={lineId}
                  line={lines[lineId]}
                  isExpanded={expandedLine === lineId}
                  onToggle={() => handleToggle(lineId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
