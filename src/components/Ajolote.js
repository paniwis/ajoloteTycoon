import React from 'react';

// Ajolote dibujado a mano en SVG. "feliz" cambia los ojos a carita contenta.
export default function Ajolote({ feliz = false, className = '' }) {
  const branquia = (x, y, rot, largo) => (
    <ellipse cx={x} cy={y} rx={largo} ry="7" transform={`rotate(${rot} ${x} ${y})`} />
  );

  return (
    <svg viewBox="0 0 200 200" className={className} aria-label="Ajolote" role="img">
      {/* Cola */}
      <path d="M128 150 C160 150 178 132 182 112 C170 126 152 134 132 132 Z" fill="#f472b6" />
      <path d="M130 148 C156 148 172 134 178 118" stroke="#ec4899" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Cuerpo */}
      <ellipse cx="100" cy="148" rx="42" ry="30" fill="#f9a8d4" />
      <ellipse cx="100" cy="156" rx="28" ry="16" fill="#fce7f3" opacity="0.8" />

      {/* Patitas */}
      <ellipse cx="66" cy="170" rx="11" ry="7" fill="#f9a8d4" transform="rotate(-20 66 170)" />
      <ellipse cx="134" cy="170" rx="11" ry="7" fill="#f9a8d4" transform="rotate(20 134 170)" />

      {/* Branquias izquierdas */}
      <g className="branquias-izq" fill="#db2777">
        {branquia(40, 62, -35, 22)}
        {branquia(32, 84, -8, 22)}
        {branquia(38, 106, 22, 20)}
      </g>
      {/* Branquias derechas */}
      <g className="branquias-der" fill="#db2777">
        {branquia(160, 62, 35, 22)}
        {branquia(168, 84, 8, 22)}
        {branquia(162, 106, -22, 20)}
      </g>

      {/* Cabeza */}
      <ellipse cx="100" cy="88" rx="62" ry="50" fill="#f9a8d4" />
      <ellipse cx="100" cy="70" rx="40" ry="18" fill="#fbcfe8" opacity="0.7" />

      {/* Ojos */}
      {feliz ? (
        <g stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M64 90 Q72 80 80 90" />
          <path d="M120 90 Q128 80 136 90" />
        </g>
      ) : (
        <g>
          <circle cx="72" cy="88" r="9" fill="#1f2937" />
          <circle cx="128" cy="88" r="9" fill="#1f2937" />
          <circle cx="75" cy="85" r="3" fill="#fff" />
          <circle cx="131" cy="85" r="3" fill="#fff" />
        </g>
      )}

      {/* Mejillas */}
      <ellipse cx="58" cy="106" rx="9" ry="5" fill="#f472b6" opacity="0.6" />
      <ellipse cx="142" cy="106" rx="9" ry="5" fill="#f472b6" opacity="0.6" />

      {/* Sonrisa */}
      <path d="M86 106 Q100 118 114 106" stroke="#9d174d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
