import React from 'react';
import BaseSlider from '@material-ui/core/Slider';
import './slider.css';

function Slider({
    id,
    name, unit, icon,
    value,
    min, max, decimals,
    marks,
    onChange
}) {
    return <div className={'slider ' + id}>
        <p className='name'>
        {name}
        </p>
        <p className='value'>
        {value.toFixed(decimals)} {unit}
        <span className='icon'>{icon}</span>
        </p>
        <BaseSlider
            value={value}
            min={min} max={max} step={Math.pow(10, -decimals)}
            marks={marks}
            onChange={(e, v) => onChange(v)}
        />
    </div>;
}

export default Slider;
