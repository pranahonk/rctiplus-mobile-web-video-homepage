import React from "react";

function CirclePlayIcon({circleColor, color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="14" cy="14" r="14" fill={circleColor || "#1A1A1A"}></circle>
        <path
          fill={color || "#3A3A3A"}
          fillRule="nonzero"
          d="M10 10.127v7.753c0 .833.836 1.373 1.584 1l7.819-3.873c.796-.42.796-1.587 0-2l-7.819-3.872A1.118 1.118 0 0011.043 9c-.581.04-1.043.5-1.043 1.127z"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(CirclePlayIcon);