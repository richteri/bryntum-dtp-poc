/**
 * @author Saki
 * @date 2019-03-04 11:00:32
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-13 21:24:51
 */
// libraries
import React, { Fragment, useRef } from 'react';

// our stuff
import Header from '../components/Header.js';
import Content from './Content.js';

const Main = props => {

    // ganttRef will be populated by Content component
    const ganttRef = useRef();

    const handleShowHeaderClick = ({ source }) => {
        ganttRef.current.ganttInstance.features.timeRanges.showHeaderElements = source.pressed;
    }

    return (
        <Fragment>
            <Header
                headerUrl = '..'
                onShowHeaderClick={handleShowHeaderClick}
            />
            <Content ref={ganttRef} />
        </Fragment>
    ); // eo return

}; // eo function main

export default Main;

// eof
