/**
 * @author Saki
 * @date 2019-02-05 17:45:31
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-14 21:00:57
 *
 * Implements the top level Main container
 */
// libraries
import React, { Component, Fragment } from 'react';
import { BryntumGantt } from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';
import { ProjectModel } from 'bryntum-gantt';

class Main extends Component {

    /**
     * Turns rollups on or off
     */
    handleRollupsClick = ({ checked }) => {
        const ganttInstance = this.refs.gantt.ganttInstance;
        ganttInstance.features.rollups.disabled = !checked;
    };

    /**
     * render method
     */
    render = () => {
        const project = new ProjectModel({
            autoLoad  : true,
            transport : {
                load : {
                    url : 'data/tasks.json'
                }
            }
        });
        return (
            <Fragment>
                <Header
                    headerUrl      = '..'
                    onRollupsClick = { this.handleRollupsClick }
                />
                <BryntumGantt
                    ref     = {'gantt'}
                    project = {project}
                    columns = {[
                        { type : 'wbs' },
                        { type : 'name' }
                    ]}
                    subGridConfigs = {{
                        locked : {
                            flex : 1
                        },
                        normal : {
                            flex : 2
                        }
                    }}
                    viewPreset     = "monthAndYear"
                    rowHeight      = {50}
                    barMargin      = {7}
                    columnLines    = {true}
                    rollupsFeature = {true}
                />
            </Fragment>
        );
    }; // eo function render
} // eo class Main

export default Main;

// eof
