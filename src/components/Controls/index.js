import React from 'react';

import {
    FaThermometerEmpty, 
    FaThermometerQuarter,
    FaThermometerHalf,
    FaThermometerThreeQuarters,
    FaThermometerFull
} from 'react-icons/fa';
import {AiOutlineSwap as Coupling} from 'react-icons/ai';
import {IoIosMagnet as Magnet} from 'react-icons/io';

import Slider from './Slider.js'

import './index.css';

// Name, max, step
const info = {
    temperature: {
        name: 'Temperature',
        min: 1,
        max: 800,
        decimals: 0,
        unit: 'K',
        icon: <FaThermometerHalf/>,
    },
    coupling: {
        name: 'Coupling Constant',
        min: 0.2,
        max: 2,
        decimals: 2,
        icon: <Coupling/>,
    },
    field: {
        name: 'External Field Strength',
        min: -0.5,
        max: 0.5,
        decimals: 3,
        unit: 'T',
        icon: <Magnet/>
    },
}


// For fun
function updateThermometer(temp) {
    let icon = <FaThermometerEmpty/>;
    if (temp > 100) {icon = <FaThermometerQuarter/>;}
    if (temp > 200) {icon = <FaThermometerHalf/>;}
    if (temp > 400) {icon = <FaThermometerThreeQuarters/>;}
    if (temp > 600) {icon = <FaThermometerFull/>;}
    info.temperature.icon = icon;
}

function Controls({state, setState}) {
    return <div id='controls'>{Object.entries(state).map(
        ([k, v]) => {
            return <Slider
                key={k} id={k}
                value={v}
                onChange={(v) => {
                    const newState = {...state};
                    newState[k] = v;
                    if (k === 'temperature') {updateThermometer(v);}
                    setState(newState);
                }}
                {...info[k]}
            />;
         }
    )}</div>
}

export default Controls;
