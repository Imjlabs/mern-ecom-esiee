import React, { Fragment, useEffect, useContext, useState } from 'react';
import OrderSuccessMessage from './OrderSuccessMessage';
import { HomeContext } from './';
import { sliderImages } from '../../admin/dashboardAdmin/Action';
import { prevSlide, nextSlide } from './Mixins';

const apiURL = process.env.REACT_APP_API_URL;

const Slider = () => {
    const { data, dispatch } = useContext(HomeContext);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        sliderImages(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalSlides = data?.sliderImages?.length || 0;

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    const goToNextSlide = () => {
        nextSlide(totalSlides, currentSlide, setCurrentSlide);
    };

    const goToPreviousSlide = () => {
        prevSlide(totalSlides, currentSlide, setCurrentSlide);
    };

    return (
        <Fragment>
            <div className="relative w-full mt-16 bg-gray-100 border-2" data-carousel="slide">
                {totalSlides > 0 ? (
                    <img
                        className="w-full"
                        src={`${apiURL}/uploads/customize/${data.sliderImages[currentSlide].slideImage}`}
                        alt="sliderImage"
                    />
                ) : null}

                {totalSlides > 0 ? (
                    <>
                        <svg
                            onClick={goToPreviousSlide}
                            className="z-10 absolute top-0 left-0 mt-64 flex justify-end items-center box-border w-12 h-12 text-gray-700 cursor-pointer hover:text-yellow-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <svg
                            onClick={goToNextSlide}
                            className="z-10 absolute top-0 right-0 mt-64 flex justify-start items-center box-border w-12 h-12 text-gray-700 cursor-pointer hover:text-yellow-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <a
                                href="#shop"
                                style={{ background: '#303031' }}
                                className="cursor-pointer box-border text-2xl text-white px-4 py-2 rounded"
                            >
                                Bienvenu sur le site ShopSphere
                            </a>
                        </div>
                    </>
                ) : null}
            </div>

            <OrderSuccessMessage />
        </Fragment>
    );
};

export default Slider;
