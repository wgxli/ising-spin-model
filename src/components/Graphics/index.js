import React, {useState, useEffect} from 'react';
import './index.css';

function Graphics() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const onResize = () => {
        const dpr = window.devicePixelRatio;
        setWidth(window.innerWidth * dpr);
        setHeight(window.innerHeight * dpr);
    }

    // Register event listeners
    useEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
    });

    return <>
        <canvas id='canvas' width={width} height={height}></canvas>
    </>;
}

export default Graphics;
