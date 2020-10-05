/**
 *- Gantt functional component
 */
import React, {forwardRef} from 'react';
import { BryntumGantt } from 'bryntum-react-shared';
import { ProjectModel } from 'bryntum-gantt';

// we use forwardRef to pass ref to Gantt up to the parent
const Gantt = forwardRef((props, ref) => {

    // create and load the project
    const project = new ProjectModel({
        autoLoad : true,
        transport : {
            load : {
                url : 'data/timeranges.json'
            }
        }
    });

    return (
        <BryntumGantt 
            flex    = "1 1 auto"
            ref     = {ref}
            project = {project}
            columns = {[{ 
                type  : 'name',
                field : 'name',
                width : 250
            }]}
            timeRangesFeature = {{
                enableResizing      : true,
                showCurrentTimeLine : false,
                showHeaderElements  : true
            }}
        />
    ); // eo return
});

export default Gantt;

// eof