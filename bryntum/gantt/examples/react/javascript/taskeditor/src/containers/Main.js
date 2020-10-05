/**
 * @author Saki
 * @date 2019-12-14 10:32:35
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-14 10:36:46
 */
// libraries
import React, { Fragment } from 'react';

// our stuff
import Header from '../components/Header.js';
import Gantt from '../components/Gantt.js';

const Main = props => {

    return (
        <Fragment>
            <Header 
                headerUrl = '..' 
            />
            <Gantt />
        </Fragment>
    ); // eo return

}; // eo function main

export default Main;

// eof
