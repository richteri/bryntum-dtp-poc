/**
 * Header tools is a simple container div that wraps the children 
 * passed in props. There can only be one tools in the page due
 * to the id we set.
 */
import React from 'react';

const tools = props => {

    return <div id="tools">{props.children ? props.children : ''}</div> ;
    
} // eo function tools

export default tools;

// eof
