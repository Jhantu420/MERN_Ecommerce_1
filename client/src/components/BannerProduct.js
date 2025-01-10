import React, { useState, useEffect } from "react";
import image1 from "../assest/banner/img1.webp";
import image2 from "../assest/banner/img2.webp";
import image3 from "../assest/banner/img3.jpg";
import image4 from "../assest/banner/img4.jpg";
import image5 from "../assest/banner/img5.webp";

import image1Mobile from "../assest/banner/img1_mobile.jpg";
import image2Mobile from "../assest/banner/img2_mobile.webp";
import image3Mobile from "../assest/banner/img3_mobile.jpg";
import image4Mobile from "../assest/banner/img4_mobile.jpg";
import image5Mobile from "../assest/banner/img5_mobile.png";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function BannerProduct() {
  const [currentImage, setCurrentImage] = useState(0);
  const desktopImages = [image1, image2, image3, image4, image5];
  const mobileImages = [
    image1Mobile,
    image2Mobile,
    image3Mobile,
    image4Mobile,
    image5Mobile,
  ];

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? desktopImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === desktopImages.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="container mx-auto">
      {/* Desktop Banner */}
      <div className="hidden md:block relative">
        <div
          className="w-full bg-slate-300 rounded-lg overflow-hidden relative"
          style={{ height: "300px" }} // Fixed height for desktop
        >
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentImage * 100}%)`,
            }}
          >
            {desktopImages.map((item, index) => (
              <div
                className="flex-shrink-0 w-full h-full"
                key={index}
                style={{ width: "100%", height: "300px" }}
              >
                <img
                  src={item}
                  alt={`Desktop Banner ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Left Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            <FaAngleLeft size={24} />
          </button>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            <FaAngleRight size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="block md:hidden">
        <div
          className="w-full bg-slate-300 rounded-lg overflow-hidden relative"
          style={{ height: "200px", padding: "0 16px" }} // Fixed height for mobile
        >
          <div
            className="flex transition-transform duration-500 "
            style={{
              transform: `translateX(-${currentImage * 100}%)`,
            }}
          >
            {mobileImages.map((item, index) => (
              <div
                className="flex-shrink-0 w-full h-full "
                key={index}
                
              >
                <img
                  src={item}
                  alt={`Mobile Banner ${index}`}
                  className="w-full h-full object-contain "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerProduct;
