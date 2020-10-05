/**
 * Main Application script
 */

import React from 'react';

// Polyfills for Edge <= 18. Remove this line if you don't need support for it.
import 'core-js/stable';

// our libraries
import { BryntumGantt } from 'bryntum-react-shared';
import { ProjectModel } from 'bryntum-gantt';

// global css
import 'bryntum-gantt/gantt.stockholm.css';
import 'bryntum-react-shared/resources/shared.scss';

// application scss
import './App.scss';

// application files
import Header from './Header';
// import ganttConfig from './ganttConfig';

const App: React.FC = () => {

    const project = new ProjectModel({
      autoLoad : true,
      transport : {
        load : {
          url : 'data/launch-saas.json'
        }
      }
    });

    return (
        <React.Fragment>
            <Header/>
            <BryntumGantt
                    project={project}
                    columns={[
                        { type : 'name', field : 'name', width : 250 }
                    ]}
                    viewPreset="weekAndDayLetter"
                    barMargin={10}
                />
        </React.Fragment>
    );
}

export default App;

// eof
