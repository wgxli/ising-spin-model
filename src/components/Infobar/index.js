import React from 'react';
import './index.css';

// Must be identical to that in frag.glsl
const boltzmann_constant = 4e-3;
const curie_scale_factor = 2/Math.log(1 + Math.sqrt(2));

function Entry({name, value}) {
    return <div className='entry'>
        <p className='name'>{name}</p>
        <p className='value'>
            {value}
            <span className='percent'>%</span>
        </p>
    </div>
}

function getCurieTemp(state) {
    const {coupling} = state;
    return curie_scale_factor * coupling/boltzmann_constant;
}

function Infobar({state, responseFunctions, simWidth, simHeight}) {
    const {coupling, temperature} = state;
    const {magnetization} = responseFunctions;

    const k = coupling / (boltzmann_constant * temperature);

    const ferromagnet = temperature < getCurieTemp(state);
    const magnetization_eq = ferromagnet ? Math.pow(1 - Math.pow(Math.sinh(2*k), -4), 1/8) : 0;
    const eq_sign = ferromagnet ? '± ' : '';

    const magnetization_text = Math.abs(magnetization).toFixed(1);
    const magnetization_sign = (magnetization < 0) ? '−' : '+';

    const simulation_size = `${Math.round(simWidth)} × ${Math.round(simHeight)}`;

    return <div className='info-bar'>
        <Entry name='Magnetization' value={`${magnetization_sign} ${magnetization_text}`}/>
        <Entry name='Spontaneous Magnetization' value={eq_sign + (100*magnetization_eq).toFixed(1)}/>
        <div className='entry'>
            <p className='caption'>
            {`Simulation Size: ${simulation_size}`}
            </p>
        </div>
        <div className='entry'>
            <p className='caption'>
                {'Made with <3 by Samuel J. Li'}</p>
        </div>
    </div>;
}

export {getCurieTemp};

export default Infobar;
