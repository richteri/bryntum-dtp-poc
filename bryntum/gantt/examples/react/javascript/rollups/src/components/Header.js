/**
 * @author Saki
 * @date 2019-06-28 22:59:44
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-12 14:28:01
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
                    type       = "checkbox"
                    text       = "Show Rollups"
                    checked    = {true}
                    toggleable = {true}
                    container  = "tools"
                    onAction   = { props.onRollupsClick }
                ></BryntumWidget>
                <FullscreenButton container='tools' />
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
