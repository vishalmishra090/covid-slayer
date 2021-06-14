import React from "react";

function Health({ healthPercentage, bg, className = "" }) {
  const styles = {
    width: healthPercentage + "%",
    backgroundColor: bg,
  };

  return (
    <div className={`health ${className && " " + className}`}>

      <div style={styles}>
          <p>{healthPercentage + "%"}</p>
      </div>

      

    </div>
  );
}

export default Health;
