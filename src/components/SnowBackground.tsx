import React from 'react';

export default function SnowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-slate-900/95" />
      <img
        src="/snow.gif"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
    </div>
  );
}
