/**
 *- Demo header implementation
 */
import React from 'react';
import { Tools, FullscreenButton } from 'bryntum-react-shared';

const header = (props : object) => {

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href=".">React Basic Gantt demo with TypeScript</a>
            </div>
            <Tools>
                <FullscreenButton container="tools"></FullscreenButton>
            </Tools>

        </header>
    );
}

export default header

// eof
