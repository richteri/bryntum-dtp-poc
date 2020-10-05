/**
 * @author Saki
 * @date 2019-06-28 22:59:44
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-13 13:53:27
 *
 * Page header container component. Contains also controls (tools).
 * It is implemented as a functional component using React hooks that
 * were introduced in React 16.8.0. If you cannot upgrade to that or
 * later version of React then you must convert this component to class.
 */
// libraries
import React from 'react';
import { Tools, FullscreenButton, BryntumWidget } from 'bryntum-react-shared';

const header = props => {
    const title = props.title || document.title || '',
          href = props.titleHref || '#'
    ;

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <BryntumWidget
                    type        = 'button'
                    container   = 'tools'
                    toggleable  = { true }
                    color       = 'b-blue b-raised'
                    text        = 'Show header elements'
                    tooltip     = 'Toggles the rendering of time range header elements'
                    pressed     = { true }
                    icon        = 'b-fa-square'
                    pressedIcon = 'b-fa-check-square'
                    onClick     = { props.onShowHeaderClick }
                ></BryntumWidget>
                <FullscreenButton container='tools' />
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
