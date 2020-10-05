// libraries
import React, { Component, Fragment } from 'react';

// our stuff
import Header from '../components/header/Header.js';
import Panel from './Panel';

class Main extends Component {
    render() {
        return (
            <Fragment>
                <Header titleHref=".."/>
                <Panel />
            </Fragment>
        );
    }
} // eo class Main

export default Main;

// eof
