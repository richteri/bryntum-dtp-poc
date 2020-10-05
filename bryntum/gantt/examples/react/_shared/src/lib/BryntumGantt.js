/**
 *- Gantt React wrapper
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Gantt, ObjectHelper, Widget } from 'bryntum-gantt';

// Defines a React component that wraps Bryntum Gantt
class BryntumGantt extends Component {

    /**
     * @deprecated in favor of ganttInstance
     */
    get ganttEngine() {
      console.warn('ganttEngine is deprecated. Use ganttInstance instead.')
      return this.ganttInstance;
    }

    // defaults for gantt. Feel free to adjust it
    static defaultProps = {
    };

    featureRe = /Feature$/;

    /* #region Features */
    features = [
        'baselinesFeature',
        'cellEditFeature',
        'cellTooltipFeature',
        'columnDragToolbarFeature',
        'columnLinesFeature',
        'columnPickerFeature',
        'columnReorderFeature',
        'columnResizeFeature',
        'criticalPathsFeature',
        'contextMenuFeature',
        'dependenciesFeature',
        'dependencyEditFeature',
        'eventContextMenuFeature',
        'eventDragCreateFeature',
        'eventDragFeature',
        'eventEditFeature',
        'eventFilterFeature',
        'eventResizeFeature',
        'eventTooltipFeature',
        'filterBarFeature',
        'filterFeature',
        'groupFeature',
        'groupSummaryFeature',
        'headerContextMenuFeature',
        'labelsFeature',
        'nonWorkingTimeFeature',
        'panFeature',
        'pdfExportFeature',
        'percentBarFeature',
        'progressLineFeature',
        'projectLinesFeature',
        'quickFindFeature',
        'recurringTimeSpansFeature',
        'regionResizeFeature',
        'resourceTimeRangesFeature',
        'rollupsFeature',
        'rowReorderFeature',
        'scheduleContextMenuFeature',
        'scheduleTooltipFeature',
        'searchFeature',
        'sortFeature',
        'stripeFeature',
        'summaryFeature',
        'taskContextMenuFeature',
        'taskDragCreateFeature',
        'taskDragFeature',
        'taskEditFeature',
        'taskResizeFeature',
        'taskTooltipFeature',
        'timeRangesFeature',
        'treeFeature'
    ];
    /* #endregion */

    /* #region Configs */
    configs = [
        'animateRemovingRows',
        'barMargin',
        'cls',
        'columnLines',
        'columns',
        'data',
        'dataset',
        'disabled',
        'displayDateFormat',
        'durationDisplayPrecision',
        'emptyText',
        'enableDeleteKey',
        'enableTextSelection',
        'endDate',
        'eventColor',
        'eventStyle',
        'fillLastColumn',
        'flex',
        'forceFit',
        'fullRowRefresh',
        'height',
        'hideHeaders',
        'listeners',
        'loadMask',
        'longPressTime',
        'managedEventSizing',
        'maxHeight',
        'maxWidth',
        'maxZoomLevel',
        'milestoneLayoutMode',
        'minHeight',
        'minWidth',
        'minZoomLevel',
        'navigator',
        'partner',
        'plugins',
        'project',
        'readOnly',
        'ref',
        'responsiveLevels',
        'ripple',
        'rowHeight',
        'scrollLeft',
        'scrollTop',
        'selectedCell',
        'selectedRecord',
        'selectedRecords',
        'showDirty',
        'showRemoveRowInContextMenu',
        'snap',
        'snapRelativeToEventStartDate',
        'startDate',
        'store',
        'style',
        'subGridConfigs',
        'taskRenderer',
        'tickWidth',
        'timeAxis',
        'timeResolution',
        'title',
        'tooltip',
        'viewportCenterDate',
        'viewPreset',
        'width',
        'workingTime',
        'zoomLevel',
        'zoomLevels'
    ];
    /* #endregion */

    state = {
        portals    : new Set(),
        generation : 0
    };

    releaseReactCell(cellElement) {
        const
            {state} = this,
            cellElementData = cellElement._domData;

        // Cell already has a react component in it, remove
        if (cellElementData.reactPortal) {
            state.portals.delete(cellElementData.reactPortal);

            this.setState({
                portals    : state.portals,
                generation : state.generation + 1
            });

            cellElementData.reactPortal = null;
        }
    }

    // React component rendered to DOM, render gantt to it
    componentDidMount() {
        const
            config = {
                adopt           : this.el,
                callOnFunctions : true,
                features        : {},

                // Hook called by engine when requesting a cell editor
                processCellEditor : ({editor, field}) => {
                    // String etc handled by feature, only care about fns returning React components here
                    if (typeof editor !== 'function') {
                        return;
                    }

                    // Wrap React editor in an empty widget, to match expectations from CellEdit/Editor and make alignment
                    // etc. work out of the box
                    const wrapperWidget = new Widget({
                        name : field // For editor to be hooked up to field correctly
                    });

                    // Ref for accessing the React editor later
                    wrapperWidget.reactRef = React.createRef();

                    // column.editor is expected to be a function returning a React component (can be JSX). Function is
                    // called with the ref from above, it has to be used as the ref for the editor to wire things up
                    const reactComponent = editor(wrapperWidget.reactRef);
                    if (reactComponent.$$typeof !== Symbol.for('react.element')) {
                        throw new Error('Expect a React element');
                    }

                    let editorValidityChecked = false;

                    // Add getter/setter for value on the wrapper, relaying to getValue()/setValue() on the React editor
                    Object.defineProperty(wrapperWidget, 'value', {
                        enumerable : true,
                        get        : function() {
                            return wrapperWidget.reactRef.current.getValue();
                        },
                        set        : function(value) {
                            const component = wrapperWidget.reactRef.current;

                            if (!editorValidityChecked) {
                                const misses = ['setValue', 'getValue', 'isValid', 'focus'].filter(fn => !(fn in component));

                                if (misses.length) {
                                    throw new Error(`
                                        Missing function${misses.length > 1 ? 's' : ''} ${misses.join(', ')} in ${component.constructor.name}.
                                        Cell editors must implement setValue, getValue, isValid and focus
                                    `);
                                }

                                editorValidityChecked = true;
                            }

                            const context = wrapperWidget.owner.cellEditorContext;
                            component.setValue(value, context);
                        }
                    });

                    // Add getter for isValid to the wrapper, mapping to isValid() on the React editor
                    Object.defineProperty(wrapperWidget, 'isValid', {
                        enumerable : true,
                        get        : function() {
                            return wrapperWidget.reactRef.current.isValid();
                        }
                    });

                    // Override widgets focus handling, relaying it to focus() on the React editor
                    wrapperWidget.focus = () => {
                        wrapperWidget.reactRef.current.focus && wrapperWidget.reactRef.current.focus();
                    };

                    // Create a portal, making the React editor belong to the React tree although displayed in a Widget
                    const portal = ReactDOM.createPortal(reactComponent, wrapperWidget.element);
                    wrapperWidget.reactPortal = portal;

                    const {state} = this;
                    // Store portal in state to let React keep track of it (inserted into the Grid component)
                    state.portals.add(portal);
                    this.setState({
                        portals    : state.portals,
                        generation : state.generation + 1
                    });

                    return {editor : wrapperWidget};
                },

                // Hook called by engine when rendering cells, creates portals for JSX supplied by renderers
                processCellContent : ({cellContent, cellElement, cellElementData, record}) => {
                    let shouldSetContent = cellContent != null;

                    // Release any existing React component
                    this.releaseReactCell(cellElement);

                    // Detect React component
                    if (cellContent && cellContent.$$typeof === Symbol.for('react.element')) {
                        // Excluding special rows for now to keep renderers simpler
                        if (!record.meta.specialRow) {
                            // Clear any non-react content
                            const firstChild = cellElement.firstChild;
                            if (!cellElementData.reactPortal && firstChild) {
                                firstChild.data = '';
                            }

                            // Create a portal, belonging to the existing React tree but render in a cell
                            const portal = ReactDOM.createPortal(cellContent, cellElement);
                            cellElementData.reactPortal = portal;

                            const {state} = this;
                            // Store in state for React to not loose track of the portals
                            state.portals.add(portal);
                            this.setState({
                                portals    : state.portals,
                                generation : state.generation + 1
                            });
                        }
                        shouldSetContent = false;
                    }

                    return shouldSetContent;
                }
            };

        // relay properties with names matching this.featureRe to features
        this.features.forEach(featureName => {
            if (featureName in this.props) {
                config.features[featureName.replace(this.featureRe, '')] = this.props[featureName];
            }
        });

        // Handle config (relaying all props except those used for features to gantt)
        Object.keys(this.props).forEach(propName => {
            if (!propName.match(this.featureRe) && undefined !== this.props[propName]) {
                if (propName === 'features') {
                    console.warn('Passing "features" object as prop is not supported. Set features one-by-one with "Feature" suffix, for example "timeRangesFeature".');
                }
                else {
                    config[propName] = this.props[propName];
                }
            }
        });

        // console.log(config);

        // Create the actual gantt, used as engine for the wrapper
        const engine = this.ganttInstance = this.props.ganttClass ? new this.props.ganttClass(config) : new Gantt(config);

        // Release any contained React components when a row is removed
        engine.rowManager.on({
            removeRow : ({ row }) => row.cells.forEach(cell => this.releaseReactCell(cell))
        });

        // Map all features from ganttInstance to gantt to simplify calls
        Object.keys(engine.features).forEach(key => {
            let featureName = key + 'Feature';
            if (!this[featureName]) {
                this[featureName] = engine.features[key];
            }
        });
    }

    // React component removed, destroy engine
    componentWillUnmount() {
        this.ganttInstance.destroy();
    }

    // Component about to be updated, from changing a prop using state. React to it depending on what changed and
    // prevent react from re-rendering our component.
    shouldComponentUpdate(nextProps, nextState) {
        const
            { props, ganttInstance : engine } = this,
            // These props are ignored or has special handling below
            excludeProps = [
                'adapter',
                'children',
                'columns',
                'events',
                'eventsVersion',
                'features', // #445 React: Scheduler crashes when features object passed as prop
                'listeners', // #9114 prevents the crash when listeners are changed at runtime
                'ref',
                'resources',
                'resourcesVersion',
                'timeRanges',
                ...this.features
            ];

        // Reflect configuration changes. Since most gantt configs are reactive the gantt will update automatically
        Object.keys(props).forEach(propName => {
            // Only apply if prop has changed
            if (!excludeProps.includes(propName) && !ObjectHelper.isEqual(props[propName], nextProps[propName])) {
                engine[propName] = nextProps[propName];
            }
        });

        // xxVersion used to flag that data has changed
        if (nextProps.resourcesVersion !== props.resourcesVersion) {
            engine.resources = nextProps.resources;
        }

        if (nextProps.eventsVersion !== props.eventsVersion) {
            engine.eventStore.data = nextProps.events;
        }

        // Reflect feature config changes
        this.features.forEach(featureName => {
            const currentProp = props[featureName],
                nextProp = nextProps[featureName];

            if (featureName in props && !ObjectHelper.isEqual(currentProp, nextProp)) {
                engine.features[featureName.replace(this.featureRe, '')].setConfig(nextProp);
            }
        });

        // Reflect JSX cell changes
        return (nextState.generation !== this.state.generation);
    }

    render() {
        return <div ref={el => this.el = el}>{this.state.portals}</div>;
    } // eo function render

} // eo class BryntumGantt

export default BryntumGantt;

// eof
