import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full pt-12 pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        {/* NYC Subway Station Sign Style - clickable to go home */}
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          {/* Station bullet */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FCCC0A' }}
          >
            <span className="text-black font-bold text-xl">PA</span>
          </div>
          {/* Station name */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Physics St & AI Ave
            </h1>
            <p className="text-dark-muted text-sm mt-1">
              Where disciplines intersect
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
