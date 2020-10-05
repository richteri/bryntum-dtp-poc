/**
 *- Implements the top level Main container
 */
// libraries
import React, { Component, Fragment } from 'react';
import { BryntumGantt } from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';
import DemoButton from '../components/DemoButton';
import DemoEditor from '../components/DemoEditor';
import { ProjectModel } from 'bryntum-gantt';

class Main extends Component {

    handleEditClick = record => {
        this.refs.gantt.ganttInstance.editTask(record);
    };

    /**
     * render method
     */
    render = () => {
        const project = new ProjectModel({
            autoLoad  : true,
            transport : {
                load : {
                    url : 'data/launch-saas.json'
                }
            }
        });
        return (
            <Fragment>
                <Header
                    headerUrl='..'
                />
                <BryntumGantt
                    ref={'gantt'}
                    project={project}
                    columns={[
                        { type : 'name', field : 'name', width : 250 },
                        {
                            text     : 'Edit<div class="small-text">(React component)</div>',
                            width    : 120,
                            editor   : false,
                            align    : 'center',
                            // Using custom React component
                            renderer : ({ record }) => record.isLeaf ?
                                <DemoButton text={'Edit'} onClick={() => this.handleEditClick(record)}/> :
                                null
                        },
                        {
                            field    : 'draggable',
                            text     : 'Draggable<div class="small-text">(React editor)</div>',
                            width    : 120,
                            align    : 'center',
                            editor   : ref => <DemoEditor ref={ref}/>,
                            renderer : ({ value }) => value ? 'Yes' : 'No'
                        }
                    ]}
                    viewPreset="weekAndDayLetter"
                    barMargin={10}
                />
            </Fragment>
        );
    }; // eo function render
} // eo class Main

export default Main;

// eof
