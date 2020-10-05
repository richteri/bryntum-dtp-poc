/**
 *- TimeRangesGrid Functional Component
 */
import React, { useRef, forwardRef, useEffect } from 'react';
import { Panel } from 'bryntum-gantt';

// we use forwardRef to pass ref to Gantt up to the parent
const TimeRangesGrid = forwardRef((props, ref) => {

    const elRef = useRef();

    useEffect(() => {
        
        const config = {

            // use this element as Grid element
            adopt : elRef.current,
            flex  : '0 0 350px',
            layout : 'fit',
            cls : 'timeranges-grid',
            disableGridRowModelWarning: true,

            items : [{
                type : 'grid',
                features : {
                    stripe : true,
                    sort   : 'startDate'
                },
                columns : [{
                    text  : 'Time ranges',
                    flex  : 1,
                    field : 'name'
                },
                {
                    type  : 'date',
                    text  : 'Start Date',
                    width : 110,
                    align : 'right',
                    field : 'startDate'
                },
                {
                    type          : 'number',
                    text          : 'Duration',
                    width         : 100,
                    field         : 'duration',
                    min           : 0,
                    instantUpdate : true,
                    renderer      : data => `${data.record.duration} d`
                }],
            }],
            
            bbar : [
                {
                    type    : 'button',
                    text    : 'Add',
                    icon    : 'b-fa-plus',
                    cls     : 'b-green',
                    tooltip : 'Add new time range',
                    onClick() {
                        ref.current.store.add({
                            name      : 'New range',
                            startDate : new Date(2019, 1, 27),
                            duration  : 5
                        });
                    }
                }
            ]            
        };

        // we need to create Panel 
        // because Grid doesn't support toolbar
        const panel = new Panel(config);

        // pass the grid ref to parent
        ref.current = panel.items[0];
        
        // eslint-disable-next-line
    }, []); // eo useEffect []

    return (
        <div ref={elRef}></div>
    )
});

export default TimeRangesGrid;

// eof
