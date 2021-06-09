import React from "react";

function ShareIcon({color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="12"
      viewBox="0 0 15 12"
    >
      <path
        fill={color || "#fff"}
        fillRule="nonzero"
        d="M14.862 4.896L9.336.096A.394.394 0 008.684.4v2.805c-4.41.125-6.538 2.337-7.55 4.202C.254 9.027.057 10.632.013 11.29a3.46 3.46 0 00-.013.308v.029l.001.002v.012l.001.001v.006l.001.001v.001c.025.198.19.35.392.35a.397.397 0 00.394-.4c0-.02 0-.07.004-.145.173-3.327 6.237-4.081 7.891-4.226V10c0 .157.09.299.23.364s.304.042.422-.06l5.526-4.8a.4.4 0 000-.607z"
      ></path>
    </svg>
  );
}

export default React.memo(ShareIcon);