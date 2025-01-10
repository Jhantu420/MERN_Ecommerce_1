import React from "react";

function Display_Image({ imgUrl, onClose }) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50 flex justify-center items-center"
      onClick={onClose} // Close modal when clicking outside the image
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <img src={imgUrl} alt="" className="max-w-full max-h-full rounded" />
      </div>
    </div>
  );
}
export default Display_Image;
