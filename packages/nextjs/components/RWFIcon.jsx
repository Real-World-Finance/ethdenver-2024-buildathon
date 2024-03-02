function Icon({ width = 30, height = 30, style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      //   style={style}
      //   fillRule="evenodd"
      //   strokeLinejoin="round"
      //   strokeMiterlimit="2"
      //   clipRule="evenodd"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 417"
    >
      <circle cx="100" cy="100" r="80" fill="#add8e6" stroke="#00f" strokeWidth="2"></circle>
      <circle cx="75" cy="85" r="10" fill="#fff" stroke="#000" strokeWidth="1.5"></circle>
      <circle cx="125" cy="85" r="10" fill="#fff" stroke="#000" strokeWidth="1.5"></circle>
      <circle cx="75" cy="85" r="5"></circle>
      <circle cx="125" cy="85" r="5"></circle>
      <path fill="transparent" stroke="#000" strokeWidth="2" d="M70 120q30 30 60 0"></path>
      <circle cx="100" cy="60" r="15" fill="gold" stroke="#b8860b" strokeWidth="2"></circle>
      <text x="100" y="65" fontFamily="Arial" fontSize="12" textAnchor="middle">
        $
      </text>
      <text x="50%" y="190" fill="#00f" fontFamily="Arial" fontSize="24" textAnchor="middle">
        RWF
      </text>
    </svg>
  );
}

export default Icon;
