/**
 * The App file. It should stay as simple as possible
 */

// Polyfills for Edge <= 18. Remove this line if you don't need support for it.
import 'core-js/stable';

// libraries
import React from 'react';

// our stuff
import 'bryntum-react-shared/resources/shared.scss';
import './App.scss';
import Main from './containers/Main';

const app = props => (<Main />);

export default app;
