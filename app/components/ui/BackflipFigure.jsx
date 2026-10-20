export default function BackflipFigure() {
  return (
    <span className="backflip-figure" aria-hidden="true">
      <svg viewBox="0 0 80 80" focusable="false">
        <ellipse className="backflip-shadow" cx="40" cy="68" rx="13" ry="3" />
        <g className="backflip-body">
          <circle className="backflip-head" cx="40" cy="17" r="5.5" />
          <path className="backflip-limb backflip-torso" d="M40 24q-3 9 1 19" />
          <g className="backflip-arms">
            <path className="backflip-limb" d="M39 29 29 35 22 43" />
            <path className="backflip-limb" d="M40 29 50 35 58 43" />
          </g>
          <g className="backflip-legs">
            <path className="backflip-limb" d="M41 43 32 51 28 60" />
            <path className="backflip-limb" d="M41 43 50 51 54 60" />
          </g>
        </g>
      </svg>
    </span>
  );
}
