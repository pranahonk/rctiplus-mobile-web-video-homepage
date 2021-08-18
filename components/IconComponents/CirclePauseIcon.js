import React from "react";

function CirclePauseIcon({circleColor, color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="14" cy="14" r="14" fill={ circleColor || "#FA262F"}></circle>
        <g fill={color || "#FFF"} transform="translate(11 9)">
          <rect width="2" height="10" x="4" rx="1"></rect>
          <rect width="2" height="10" rx="1"></rect>
        </g>
      </g>
    </svg>
  );
}

export default React.memo(CirclePauseIcon);