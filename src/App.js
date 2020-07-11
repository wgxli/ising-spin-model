import React, {useState, useEffect} from 'react';

import Graphics from './components/Graphics';
import Controls from './components/Controls';
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


    // Prevent zoom on mobile
    const preventDefault = (e) => e.preventDefault();
    useEffect(() => {
        document.addEventListener('gesturestart', preventDefault, {passive: false});
        document.addEventListener('touchmove', preventDefault, {passive: false});
    });

    return <>
        <Graphics/>
        <Controls state={state} setState={setState}/>
        <HelpText/>
    </>;
}

export default App;
