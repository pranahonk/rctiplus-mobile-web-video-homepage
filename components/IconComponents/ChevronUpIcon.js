import React from "react";

function ChevronUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M10.498 6.444a.733.733 0 00-.52.216l-4.512 4.513a.735.735 0 101.039 1.04l3.993-3.994 3.994 3.992a.735.735 0 101.039-1.04l-4.513-4.51a.733.733 0 00-.52-.216z"
        ></path>
        <path d="M0-1h21v21H0z"></path>
      </g>
    </svg>
  );
}

export default React.memo(ChevronUpIcon);