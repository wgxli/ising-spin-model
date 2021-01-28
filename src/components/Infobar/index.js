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

function Infobar({state, simWidth, simHeight}) {
    let {coupling} = state;

    let curie_temp = curie_scale_factor * coupling/boltzmann_constant

    return <div className='info-bar'>
        <Entry name='Curie Temperature' value={curie_temp.toFixed(1) + ' K'}/>
        <Entry name='Simulation Size' value={Math.round(simWidth) + ' × ' + Math.round(simHeight)}/>
    </div>;
}

export default Infobar;
