/**
 * Page header component. Contains also controls (tools)
 */

// libraries
import React from 'react';

// our stuff
import { BryntumWidget, FullscreenButton, Tools } from 'bryntum-react-shared';

const header = props => {
    const
        title = props.title || document.title || '',
        href = props.titleHref || '#';

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <BryntumWidget
                    type        = "button"
                    text        = "Export to PDF/PNG"
                    cls         = "b-orange b-raised b-skip-test"
                    // eslint-disable-next-line
                    style       = "margin-right: 1em"
                    listeners   = {{ click : props.onExportClick }}
                    container   = "tools"
                ></BryntumWidget>
                <FullscreenButton container='tools'/>
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
