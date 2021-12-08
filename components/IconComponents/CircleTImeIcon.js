import React from "react";

function CircleTImeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="14" cy="14" r="14" fill="#1A1A1A"></circle>
        <path
          fill="#3A3A3A"
          fillRule="nonzero"
          d="M14 8c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm2.854 9.103a.5.5 0 01-.707 0l-2.5-2.5a.492.492 0 01-.147-.353V11a.5.5 0 011 0v3.043l2.354 2.353a.5.5 0 010 .707z"
        ></path>
      </g>
    </svg>
  );
}

export default React.memo(CircleTImeIcon);