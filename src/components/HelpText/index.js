import React, {useState} from 'react';
import {IoIosMagnet as Magnet} from 'react-icons/io';
import './index.css';

function HelpText() {
    const [open, setOpen] = useState(true);

    return <>
        <div className={'help-container ' + (open ? 'open' : 'closed')} onClick={() => setOpen(false)}>
        <div className='help-text' onClick={(e) => e.stopPropagation()}>
            <div className='header'>
                <span className='icon'><Magnet/></span>
                <div className='title'>
                    Ising Spin Model
                    <p className='subtitle'>Made with {'<3'} by Samuel J. Li</p>
                </div>
            </div>
            The <b>Ising spin model</b> is a simplified model of ferromagnetic material (e.g. iron) at the microscopic level.
            Each pixel represents an electron, and its color represents the direction of its spin.

            <p>Each electron is influenced by two opposing forces:</p>
            <ul>
                <li><b>Magnetism</b>, which tends to align the spin of each electron with its neighbors and the external magnetic field, and</li>
                <li><b>Temperature</b>, which causes random flucuations in orientation.</li>
            </ul>
            Despite its simplicity, the model exhibits complex behavior, including spontaneous magnetization, magnetic domains, and a Curie temperature.
            <button onClick={() => setOpen(false)}>Got it!</button>
            
        </div></div>
    </>
}

export default HelpText;
