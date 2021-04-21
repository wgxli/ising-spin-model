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
import {getCurieTemp} from '../Infobar';

import './index.css';

const KELVIN_OFFSET = 273.15;

// Name, max, step
const info = {
    temperature: {
        name: 'Temperature',
        min: -50,
        max: 100,
        decimals: 1,
        unit: '°C',
        icon: <FaThermometerHalf/>,
    },
    coupling: {
        name: 'Coupling Constant',
        min: 0.45,
        max: 0.55,
        decimals: 3,
        icon: <Coupling/>,
    },
    field: {
        name: 'External Field Strength',
        min: -0.1,
        max: 0.1,
        decimals: 3,
        unit: 'T',
        icon: <Magnet/>,
    },
}


// For fun
function updateThermometer(temp) {
    let icon = <FaThermometerEmpty/>;
    if (temp > -60) {icon = <FaThermometerQuarter/>;}
    if (temp > -20) {icon = <FaThermometerHalf/>;}
    if (temp > 20) {icon = <FaThermometerThreeQuarters/>;}
    if (temp > 60) {icon = <FaThermometerFull/>;}
    info.temperature.icon = icon;
}

function setCurieTemperature(state) {
    const {temperature} = state;
    const Tc = getCurieTemp(state);
    const ferromagnet = (temperature < Tc);

    const inactive = 'hsl(220, 10%, 70%)';
    const active = 'hsl(220, 80%, 35%)';

    info.temperature.marks = [{
        value: Tc - KELVIN_OFFSET,
        label: <span className='mark'>
            <span className='aux-label' style={{
                color: ferromagnet ? active : inactive,
            }}>
                {'Ferromagnet'}
            </span>
            <span style={{color: 'hsl(200, 10%, 20%)'}}>T<sub>c</sub></span>
            <span className='aux-label' style={{
                color: ferromagnet ? inactive : active,
            }}>
                {'Paramagnet'}
            </span>
        </span>,
    }];
}

function Controls({state, setState}) {
    setCurieTemperature(state);
    return <div id='controls'>{Object.entries(state).map(
        ([k, v]) => {
            const is_T = (k === 'temperature');
            const offset = is_T ? KELVIN_OFFSET : 0;
            return <Slider
                key={k} id={k}
                value={v - offset}
                onChange={(v) => {
                    const newState = {...state};
                    if (is_T) {
                        updateThermometer(v);
                    }
                    newState[k] = v + offset;
                    setState(newState);
                }}
                {...info[k]}
            />;
         }
    )}</div>
}

export default Controls;
