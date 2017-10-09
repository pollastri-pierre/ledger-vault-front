import React from 'react';

function Hourglass(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 32" {...props}>
      <title>hourglass</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="Hourglass">
            <path style={{ fill: 'none', strokeLimit: 10 }} d="M25.5,31V26.86c0-3.28-6.06-10.16-6.32-10.86.27-.69,6.32-7.58,6.32-10.86V1M4.5,1V5.14c0,3.28,6.05,10.22,6.3,10.87-.23.64-6.3,7.59-6.3,10.85V31m19.25-2.14" />
            <line style={{ fill: 'none', strokeWidth: '2px' }} x1="3.18" y1="1" x2="26.82" y2="1" />
            <line style={{ fill: 'none ', strokeLimiter: 10 }} y1="1" x2="30" y2="1" />
            <line style={{ fill: 'none', strokeWidth: '2px' }} x1="3.18" y1="31" x2="26.82" y2="31" />
            <line style={{ fill: 'none ', strokeLimiter: 10 }} y1="31" x2="30" y2="31" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default Hourglass;



