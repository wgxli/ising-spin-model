import React, {useState, useEffect} from 'react';
import './index.css';

function Graphics({width, height}) {
    return <canvas id='canvas' width={width} height={height}></canvas>;
}

export default Graphics;
