import React from 'react';
import './index.css';

function Graphics({width, height}) {
    return <canvas id='canvas' width={width} height={height}></canvas>;
}

export default Graphics;
