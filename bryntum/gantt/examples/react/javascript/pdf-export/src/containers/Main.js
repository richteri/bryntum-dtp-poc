/**
 * Implements the top level Main container
 */

// libraries
import React, { Fragment, useRef } from 'react';
import { BryntumGantt } from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';
import { ProjectModel } from 'bryntum-gantt';

const app = props => {
    // eslint-disable-next-line
    const gantt = useRef(null);

    const project = new ProjectModel({
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/launch-saas.json'
            }
        }
    });

    const onExportClick = () => {
        gantt.current.ganttInstance.features.pdfExport.showExportDialog();
    };

    return (
        <Fragment>
            <Header onExportClick={onExportClick} />
            <BryntumGantt
                ref = { gantt }
                project = { project }
                pdfExportFeature    = {{
                    exportServer            : 'http://localhost:8080',
                    // Development config
                    translateURLsToAbsolute : 'http://localhost:3000',
                    clientURL               : 'http://localhost:3000',
                    // For production replace with this one. See README.md for explanation
                    // translateURLsToAbsolute : 'http://localhost:8080/resources/', // Trailing slash is important

                    keepPathName : false
                }}
                viewPreset="weekAndDayLetter"
                barMargin={ 10 }
            />
        </Fragment>
    );
}

export default app;
