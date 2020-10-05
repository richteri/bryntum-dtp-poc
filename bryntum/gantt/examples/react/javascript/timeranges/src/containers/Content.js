/**
 * Content functional component
 */
// libraries
import React, { useEffect, useRef, forwardRef } from 'react';
import { Toast } from 'bryntum-gantt';
import { BryntumWidget } from 'bryntum-react-shared';

// our stuff
import 'bryntum-gantt/gantt.stockholm.css';
import Gantt from '../components/Gantt';
import Grid from '../components/TimeRangesGrid';

// we use forwardRef to pass ref to Gantt up to the parent
const Content = forwardRef((props, ref) => {
    const
        ganttRef = useRef(),
        gridRef = useRef()
    ;

    // equivalent of componentDidMount
    useEffect(() => {

        Toast.show({
            timeout : 3500,
            html : 'Please note that this example uses the Bryntum Grid, which is licensed separately.'
        });

        // set grid store to gantt timeRangesStore
        gridRef.current.store = ganttRef.current.ganttInstance.features.timeRanges.store;

        // populate ref passed by the parent
        ref.current = ganttRef.current;

        // eslint-disable-next-line
    }, []); // eo useEffect []

    return (
        <div ref={ref} id="content">
            <Gantt ref={ganttRef} />
            <BryntumWidget type="splitter" />
            <Grid ref={gridRef} />
        </div>
    );

}) // eo function Content

export default Content;

// eof