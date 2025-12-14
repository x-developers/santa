import { useMemo } from 'react'

export default function Snowflakes() {
  const snowflakes = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 12 + Math.random() * 12
    })), []
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute text-white/30 animate-fall"
          style={{
            left: `${flake.left}%`,
            top: '-20px',
            fontSize: `${flake.size}px`,
            '--delay': `${flake.delay}s`,
            '--duration': `${flake.duration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}
