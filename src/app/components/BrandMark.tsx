// Ramp Recover logo mark: a green ramp with a rising arrow on the brand-blue tile.
// Matches public/brand/ramp-recover-mark.svg; size it with className (e.g. "h-11 w-11").
export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-[25%] bg-linear-to-br from-primary-500 to-primary-700 ${className}`}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
        <g transform="translate(2 -3)">
          <path
            d="M31 50H50V31Z"
            className="fill-secondary-500 stroke-secondary-500"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path
            d="M12 44H21L42 23M34 22H43V31"
            fill="none"
            className="stroke-white"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </span>
  );
}
