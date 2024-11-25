import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./Slide.css";

import i2 from "./i2.png";
import i3 from "./i3.png";
import i4 from "./i4.png";
import i13 from "./i13.png";
import i14 from "./i14.png";
import i55 from "./i55.png";
import i7 from "./i7.png";
import i8 from "./i8.png";
import i9 from "./i9.png";
import i10 from "./i10.png";
import i11 from "./i11.png";
import i111 from "./i111.png";

const OurCustomer = () => {
    const images = [ i2, i3, i4, i13, i14 ,i55 ,i7,i8,i9,i10,i11,i111];
    const imageLinks = [

    ];

    const [isLoaded, setIsLoaded] = useState(false);
    const sliderRef = useRef(null);

    const preloadImages = (images) => {
        let loadedImages = 0;
        const totalImages = images.length;

        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImages += 1;
                if (loadedImages === totalImages) {
                    setIsLoaded(true);
                }
            };
        });
    };

    useEffect(() => {
        preloadImages(images);
    }, [images]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        pauseOnHover: false,
        beforeChange: (current, next) => {
            if (sliderRef.current) {
                sliderRef.current.slickGoTo(next);
            }
        },
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 360,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section className="py-10 lg:max-w-7xl max-w-[300px] mb-10 mx-auto">
          <h1 className='text-3xl lg:ml-28 ml-0 font-bold text-lightblue'>OUR VALUED CUSTOMERS</h1>
          <div className="h-2 w-10 lg:w-16 bg-lightblue ml-2 lg:ml-28 mt-0 lg:mt-2 lg:mb-6"></div>
        <div className="">
            {isLoaded ? (
                <Slider ref={sliderRef} {...settings}>
                    {images.map((src, index) => (
                        <div key={index} className="slide-item">
                            <a href={imageLinks[index]} target="_blank" rel="noopener noreferrer" className="image-link">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="object-contain w-full p-2 lg:p-0 md:w-3/4 mx-auto slide-image"
                                    style={{ maxHeight: '300px' }}
                                />
                            </a>
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="flex justify-center items-center" style={{ height: '300px' }}>
                    <span>Loading...</span>
                </div>
            )}
        </div>
    </section>
    

    );
};

export default OurCustomer;
