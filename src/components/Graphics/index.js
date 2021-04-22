import React from 'react';
import './index.css';

function Graphics({width, height}) {
    return <>
        <div className='loading'>Loading...</div>
        <canvas id='canvas' width={width} height={height}></canvas>
    </>;
}

export default Graphics;
