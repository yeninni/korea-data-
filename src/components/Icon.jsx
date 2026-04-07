const iconPaths = {
  locker: "M5 7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v13H5V7Zm3 1h8m-4 4v3m-3-3h.01m6 0h.01",
  lockerPin:
    "M12 22s7-5.5 7-12a7 7 0 0 0-14 0c0 6.5 7 12 7 12Zm-3-12.5A2.5 2.5 0 0 1 11.5 7h1A2.5 2.5 0 0 1 15 9.5V14H9V9.5Zm1.5-1.5h3M11 11h2m-2 2h.01m2 0h.01",
  map: "M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6",
  bus: "M6 17h12M7 17v2m10-2v2M6 5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm1 4h10m-9 4h.01m8 0h.01",
  luggage: "M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1m-9 0h10a2 2 0 0 1 2 2v11H5V8a2 2 0 0 1 2-2Zm2 15v-2m6 2v-2",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5-2.4 4-5.4 4-9s-1.5-6.6-4-9m0 18c-2.5-2.4-4-5.4-4-9s1.5-6.6 4-9M3.6 9h16.8M3.6 15h16.8",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  sliders: "M4 7h10m4 0h2M4 17h2m4 0h10M14 5v4M8 15v4"
};

export default function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
