// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function MealCarousel() {
    return (
        <Carousel>
            <div>
                <img alt='' src="/burger.png" />
                <p className="legend">Burger</p>
            </div>
            <div>
                <img alt='' src="/salad.png" />
                <p className="legend">Salad</p>
            </div>
            <div>
                <img alt='' src="tofu.png" />
                <p className="legend">Tofu</p>
            </div>
        </Carousel>
    )
}