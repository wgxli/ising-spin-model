import React, {useState, useEffect} from 'react';

import Graphics from './components/Graphics';
import Controls from './components/Controls';
import Infobar from './components/Infobar';
import HelpText from './components/HelpText';

import {setState as setGLState} from './simulation';

import './App.css';


function App() {
    const [state, setAppState] = useState({
        temperature: 273,
        coupling: 0.5,
        field: 0,
    });
    const setState = (s) => {
        for (let [k, v] of Object.entries(s)) {
            setGLState(k, v);
        }
        setAppState(s);
    }

    // Resize handler
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const onResize = () => {
        const dpr = window.devicePixelRatio;
        setWidth(window.innerWidth * dpr);
        setHeight(window.innerHeight * dpr);
    }
    useEffect(() => {
        window.addEventListener('resize', onResize);
        onResize();
    });



    // Prevent zoom on mobile
    const preventDefault = (e) => e.preventDefault();
    useEffect(() => {
        document.addEventListener('gesturestart', preventDefault, {passive: false});
        document.addEventListener('touchmove', preventDefault, {passive: false});
    });

    return <>
        <Graphics width={width} height={height}/>
        <Controls state={state} setState={setState}/>
        <Infobar state={state} simWidth={2 * width} simHeight={2 * height}/>
        <HelpText/>
    </>;
}

export default App;
