import React from 'react';
import './index.css';

// Must be identical to that in frag.glsl
const boltzmann_constant = 4e-3;
const curie_scale_factor = 2/Math.log(1 + Math.sqrt(2));

function Entry({name, value}) {
    return <div className='entry'>
        <p className='name'>{name}</p>
        <p className='value'>{value}</p>
    </div>
}

function getCurieTemp(state) {
    let {coupling} = state;
    return curie_scale_factor * coupling/boltzmann_constant;
}

function Infobar({state, simWidth, simHeight}) {
    let {coupling, temperature} = state;

    const k = coupling / (boltzmann_constant * temperature);

    const ferromagnet = temperature < getCurieTemp(state);
    const magnetization_eq = ferromagnet ? Math.pow(1 - Math.pow(Math.sinh(2*k), -4), 1/8) : 0;

    return <div className='info-bar'>
        <Entry name='Spontaneous Magnetization' value={(100*magnetization_eq).toFixed(0) + '%'}/>
        <Entry name='Simulation Size' value={Math.round(simWidth) + ' × ' + Math.round(simHeight)}/>
    </div>;
}

export {getCurieTemp};

export default Infobar;
