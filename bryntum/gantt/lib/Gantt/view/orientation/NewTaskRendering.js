import Base from '../../../Core/Base.js';
import DomSync from '../../../Core/helper/DomSync.js';
import DomClassList from '../../../Core/helper/util/DomClassList.js';
import Rectangle from '../../../Core/helper/util/Rectangle.js';
import DateHelper from '../../../Core/helper/DateHelper.js';

// TODO: No need to keep this as an "orientation", make it a mixin for Gantt instead

const
    releaseEventActions  = {
        releaseElement : 1, // Not used at all at the moment
        reuseElement   : 1  // Used by some other element
    },
    renderEventActions   = {
        newElement      : 1,
        reuseOwnElement : 1,
        reuseElement    : 1
    },
    // Used to render more ticks than actually visible
    horizontalTickBuffer = 100;

/**
 * Handles rendering of tasks, using the following strategy:
 *
 * 1. When a row is rendered, it collects a DOM config for its task bar and stores in a map (row -> config)
 * 2. When a rendering pass is done, it syncs the DOM configs from the map to DOM
 *
 * The need for caching with this approach is minimal, only the map needs to be kept up to date with available rows.
 *
 * @extends Core/Base
 */
export default class NewTaskRendering extends Base {

    //region Config & Init

    static get properties() {
        return {
            rowMap : new Map()
        };
    }

    construct(gantt) {
        this.gantt = gantt;

        gantt.rowManager.on({
            renderDone      : 'onRenderDone',
            removeRows      : 'onRemoveRows',
            beforeRowHeight : 'onBeforeRowHeightChange',
            thisObj         : this
        });

        super.construct({});
    }

    init() {}

    //endregion

    //region View hooks

    bindTaskStore() {}

    refreshRows() {}

    onTimeAxisViewModelUpdate() {
        // Update view bounds
        this.updateFromHorizontalScroll(this.gantt.timeAxisSubGrid.scrollable.x);
    }

    onViewportResize() {}

    onDragAbort() {}

    onBeforeRowHeightChange(event) {
        const { gantt } = this;

        if (gantt.foregroundCanvas) {
            //gantt.element.classList.add('b-notransition');
            gantt.foregroundCanvas.style.fontSize = `${(event && event.height || gantt.rowHeight) - gantt.resourceMargin * 2}px`;
            //gantt.element.classList.remove('b-notransition');
        }
    }

    //endregion

    //region Region & coordinates

    get visibleDateRange() {
        return this._visibleDateRange;
    }

    // to be consistent with Scheduler view orientations
    getVisibleDateRange() {
        return this.visibleDateRange;
    }

    getTaskBox(taskRecord, includeOutside = false, inner = false) {
        const { gantt } = this;

        if (inner) {
            const innerElement = this.getElementFromTaskRecord(taskRecord);

            if (innerElement) {
                return Rectangle.from(innerElement, gantt.timeAxisSubGridElement);
            }
        }

        // A task that gets startDate during initial propagation, which seems not have happened yet.
        // Or a removed task (this fn is also used for baselines). Nothing to render then
        if (!taskRecord.startDate || (taskRecord.isTask && !gantt.taskStore.isAvailable(taskRecord))) {
            return null;
        }

        const positionData = this.getSizeAndPosition(taskRecord, includeOutside);

        if (!positionData) {
            return null;
        }

        const
            { position, width } = positionData,
            top    = gantt.taskStore.indexOf(taskRecord) * gantt.rowManager.rowOffsetHeight + gantt.resourceMargin,
            height = gantt.rowHeight - gantt.resourceMargin * 2;

        return new Rectangle(position, top, width, height);
    }

    // returns an object with `position` + `width`. If task is not inside current time axis, position is -1
    getSizeAndPosition(taskRecord, includeOutside) {
        const
            me                   = this,
            { gantt }            = me,
            { timeAxis }         = gantt,
            viewStart            = timeAxis.startDate,
            viewEnd              = timeAxis.endDate,
            taskStart            = taskRecord.startDate,
            // Might get here before engine has normalized
            taskEnd              = taskRecord.endDate || (taskRecord.duration != null
                ? DateHelper.add(taskStart, taskRecord.duration, taskRecord.durationUnit) : null),
            isMilestone          = taskRecord.milestone,
            horizontalAdjustment = isMilestone ? gantt.features.dependencies.pathFinder.startArrowMargin : 0;

        let startCoordinate, endCoordinate;

        // Early bailout for tasks that are fully out of timeaxis
        if (!includeOutside && (taskEnd < viewStart || taskStart > viewEnd)) {
            return null;
        }

        // The calls using `includeOutside` are not used during task rendering, but when rendering dependencies.
        // In those cases the lines are expected to be drawn even to tasks fully out of view, clipped to view bounds
        if (includeOutside && taskStart < viewStart) {
            startCoordinate = gantt.getCoordinateFromDate(viewStart) - horizontalAdjustment;
        }
        else if (includeOutside && taskStart > viewEnd) {
            startCoordinate = gantt.getCoordinateFromDate(viewEnd) + horizontalAdjustment;
        }
        // Starts before view and ends in or after view, approximate startCoordinate
        else if (taskStart < viewStart) {
            const
                // Using seconds instead of ms in a try to not loose to much precision in year views
                pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                secondsOutOfView = (timeAxis.startMS - taskRecord.startDateMS) / 1000, // taskRecord.startDateMS is cached in TimeSpan
                pxOutOfView      = secondsOutOfView * pxPerSecond;

            startCoordinate = gantt.getCoordinateFromDate(viewStart) - pxOutOfView;
        }
        // The "normal" case, somewhere in the timeaxis
        else {
            startCoordinate = gantt.getCoordinateFromDate(taskStart);
        }

        if (!isMilestone) {
            // Same logic applies to `includeOutside` for end date, clip to view
            if (includeOutside && taskEnd < viewStart) {
                endCoordinate = gantt.getCoordinateFromDate(viewStart) - horizontalAdjustment;
            }
            else if (includeOutside && taskEnd > viewEnd) {
                endCoordinate = gantt.getCoordinateFromDate(viewEnd) + horizontalAdjustment;
            }
            // Starts in or before view and ends outside, approximate end
            else if (taskEnd > viewEnd) {
                const
                    pxPerSecond      = gantt.timeAxisViewModel.getSingleUnitInPixels('second'),
                    secondsOutOfView = (taskRecord.endDateMS - timeAxis.endMS) / 1000, // taskRecord.endDateMS is cached in TimeSpan
                    pxOutOfView      = secondsOutOfView * pxPerSecond;

                endCoordinate = gantt.getCoordinateFromDate(viewEnd) + pxOutOfView;
            }
            else {
                endCoordinate = gantt.getCoordinateFromDate(taskEnd);
            }
        }

        const width = isMilestone ? 0 : endCoordinate - startCoordinate;

        //<debug>
        if (width < 0) {
            throw new Error(`Invalid width for task ${taskRecord.name}`);
        }
        //</debug>

        if (!includeOutside && startCoordinate + width < 0) {
            return null;
        }

        return {
            position : startCoordinate,
            width
        };
    }

    getRowRegion(taskRecord, startDate, endDate) {
        const
            { gantt } = this,
            row       = gantt.getRowFor(taskRecord);

        // might not be rendered
        if (!row) {
            return null;
        }

        const
            rowElement = row.getElement(gantt.timeAxisSubGrid.region),
            taStart    = gantt.timeAxis.startDate,
            taEnd      = gantt.timeAxis.endDate,
            start      = startDate ? DateHelper.max(taStart, startDate) : taStart,
            end        = endDate ? DateHelper.min(taEnd, endDate) : taEnd,
            startX     = gantt.getCoordinateFromDate(start),
            endX       = gantt.getCoordinateFromDate(end, true, true),
            y          = row.top + gantt.scrollTop,
            x          = Math.min(startX, endX),
            bottom     = y + rowElement.offsetHeight;

        return new Rectangle(x, y, Math.max(startX, endX) - x, bottom - y);
    }

    getDateFromXY(xy, roundingMethod, local) {
        let coord = xy[0];

        if (!local) {
            coord = this.translateToScheduleCoordinate(coord);
        }

        return this.gantt.timeAxisViewModel.getDateFromPosition(coord, roundingMethod);
    }

    translateToScheduleCoordinate(x) {
        const pos = x - this.gantt.timeAxisSubGridElement.getBoundingClientRect().left;

        return pos + this.gantt.scrollLeft;
    }

    translateToPageCoordinate(x) {
        const element = this.gantt.timeAxisSubGridElement;
        return x + element.getBoundingClientRect().left - element.scrollLeft;
    }

    //endregion

    //region Element <-> Record mapping

    getElementFromTaskRecord(taskRecord, inner = true) {
        const row = this.gantt.rowManager.getRowFor(taskRecord);
        if (row && this.rowMap.has(row)) {
            const wrapper = this.rowMap.get(row)[0]._element;
            if (wrapper) {
                return inner ? wrapper.syncIdMap.task : wrapper;
            }
        }
        return null;
    }

    //endregion

    //region Dependency connectors

    // Cannot be moved from this file, called from currentOrientation.xx

    /**
     * Gets displaying item start side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorStartSide(taskRecord) {
        return 'left';
    }

    /**
     * Gets displaying item end side
     *
     * @param {Gantt.model.TaskModel} taskRecord
     * @return {String} 'left' / 'right' / 'top' / 'bottom'
     */
    getConnectorEndSide(taskRecord) {
        return 'right';
    }

    //endregion

    //region Rendering

    onRemoveRows({ rows }) {
        rows.forEach(row => this.rowMap.delete(row));
        this.onRenderDone();
    }

    // Update header range on horizontal scroll. No need to draw any tasks, Gantt only cares about vertical scroll
    updateFromHorizontalScroll(scrollLeft) {
        const
            me               = this,
            { gantt }        = me,
            width            = gantt.timeAxisSubGrid.width,
            startDate        = gantt.getDateFromX(Math.max(0, scrollLeft - horizontalTickBuffer)),
            endDate          = gantt.getDateFromX(scrollLeft + width + horizontalTickBuffer) || gantt.endDate,
            visibleStartDate = gantt.getDateFromX(scrollLeft),
            visibleEndDate   = gantt.getDateFromX(scrollLeft + width) || gantt.endDate;

        // timeRange start/end dates represent first/last rendered dates which could be outside of the view since
        // buffer is used. We need to additionally resolve actually visible start/end dates.
        this._visibleDateRange = {
            startDate : visibleStartDate,
            endDate   : visibleEndDate
        };

        // Update timeaxis header making it display the new dates
        this.gantt.timeView.range = { startDate, endDate };
    }

    populateTaskRenderData(renderData, taskRecord) {
        const
            me                = this,
            { gantt }         = me,
            baselinesDisabled = !!(gantt.features.baselines && gantt.features.baselines.disabled);

        const taskContent = {
            className : 'b-gantt-task-content',
            dataset   : {
                taskBarFeature : 'content'
            },
            children : []
        };

        if (renderData) {
            let resizable = (taskRecord.isResizable === undefined ? true : taskRecord.isResizable);
            if (renderData.startsOutsideView) {
                if (resizable === true) {
                    resizable = 'end';
                }
                else if (resizable === 'start') {
                    resizable = false;
                }
            }
            if (renderData.endsOutsideView) {
                if (resizable === true) {
                    resizable = 'start';
                }
                else if (resizable === 'end') {
                    resizable = false;
                }
            }

            Object.assign(renderData, {
                iconCls    : new DomClassList(taskRecord.taskIconCls),
                id         : gantt.getEventRenderId(taskRecord),
                style      : taskRecord.style || '',
                taskId     : taskRecord.id,
                // Classes for the wrapping div
                wrapperCls : new DomClassList({
                    [gantt.eventCls + '-wrap']   : 1,
                    [`${gantt.eventCls}-parent`] : taskRecord.isParent,
                    'b-milestone-wrap'           : taskRecord.milestone,
                    'b-has-baselines'            : taskRecord.hasBaselines && !baselinesDisabled
                }),
                // Task record cls property is now a DomClassList, so clone it
                // so that it can be manipulated here and by renderers.
                cls          : taskRecord.isResourceTimeRange ? new DomClassList() : taskRecord.cls.clone(),
                // Extra DOMConfigs to add to the tasks row, for example for indicators
                extraConfigs : []
            });

            // Gather event element classes as keys to add to the renderData.cls DomClassList.
            // Truthy value means the key will be added as a class name.
            Object.assign(renderData.cls, {
                [gantt.eventCls]                       : 1,
                [gantt.generatedIdCls]                 : taskRecord.hasGeneratedId,
                [gantt.dirtyCls]                       : taskRecord.modifications,
                [gantt.committingCls]                  : taskRecord.isCommitting,
                [gantt.endsOutsideViewCls]             : renderData.endsOutsideView,
                [gantt.startsOutsideViewCls]           : renderData.startsOutsideView,
                [gantt.fixedEventCls]                  : taskRecord.isDraggable === false,
                [`b-sch-event-resizable-${resizable}`] : 1,
                'b-milestone'                          : taskRecord.milestone,
                'b-critical'                           : taskRecord.critical,
                'b-task-started'                       : taskRecord.percentDone > 0,
                'b-task-finished'                      : taskRecord.isCompleted,
                'b-task-selected'                      : gantt.selectedRecords.includes(taskRecord)
            });

            const
                eventStyle = taskRecord.eventStyle || gantt.eventStyle,
                eventColor = taskRecord.eventColor || gantt.eventColor;

            renderData.eventColor = eventColor;
            renderData.eventStyle = eventStyle;

            if (gantt.taskRenderer) {
                // User has specified a renderer fn, either to return a simple string, or an object
                const value = gantt.taskRenderer.call(gantt.taskRendererThisObj || gantt, {
                    taskRecord,
                    tplData : renderData,
                    renderData
                });

                // If the user's renderer coerced it into a string, recreate a DomClassList.
                if (typeof renderData.cls === 'string') {
                    renderData.cls = new DomClassList(renderData.cls);
                }

                // Same goes for iconCls
                if (typeof renderData.iconCls === 'string') {
                    renderData.iconCls = new DomClassList(renderData.iconCls);
                }

                if (typeof renderData.wrapperCls === 'string') {
                    renderData.wrapperCls = new DomClassList(renderData.wrapperCls);
                }

                let childContent = null;

                // Likely HTML content
                if (typeof value === 'string' && value.includes('<')) {
                    childContent = {
                        html : value
                    };
                }
                // DOM config or plain string can be used as is
                else if (typeof value === 'string' || typeof value === 'object') {
                    childContent = value;
                }
                // Other, use string
                else if (value != null) {
                    childContent = String(value);
                }

                if (childContent) {
                    taskContent.children.push(childContent);
                    renderData.cls.add('b-has-content');
                }
            }

            // If there are any iconCls entries...
            renderData.cls['b-sch-event-withicon'] = renderData.iconCls.length;

            // renderers have last say on style & color
            renderData.wrapperCls[`b-sch-style-${renderData.eventStyle}`] = renderData.eventStyle;

            if (renderData.eventColor && renderData.eventColor.startsWith('#')) {
                renderData.style = `background-color:${renderData.eventColor};` + renderData.style;
            }
            else {
                renderData.wrapperCls[`b-sch-color-${renderData.eventColor}`] = renderData.eventColor;
            }

            if (renderData.iconCls && renderData.iconCls.length) {
                taskContent.children.unshift({
                    tag       : 'i',
                    className : renderData.iconCls
                });
            }

            if (taskContent.children.length) {
                renderData.children.push(taskContent);
            }
        }

        renderData.taskContent = taskContent;

        renderData.wrapperChildren = [];

        // Method which features may chain in to
        gantt.onTaskDataGenerated(renderData);
    }

    // Called per row in "view", collect configs
    renderer({ row, record : taskRecord }) {
        const
            me  = this,
            box = me.getTaskBox(taskRecord);

        // Task is not visible (outside bounds of TimeAxis).
        // Remove any previous DOM config to have element released
        if (!box) {
            me.rowMap.delete(row);
            return;
        }

        const
            data = {
                top      : box.top,
                left     : box.left,
                width    : box.width,
                height   : box.height,
                taskRecord,
                task     : taskRecord, // TODO: Deprecate
                row,
                children : []
            };

        me.populateTaskRenderData(data, taskRecord);

        const config = {
            className : data.wrapperCls,
            tabIndex  : '0',
            children  : [
                {
                    className : data.cls,
                    style     : (data.internalStyle || '') + (data.style || ''),
                    children  : data.children,
                    dataset   : {
                        // Each feature putting contents in the task wrap should have this to simplify syncing and
                        // element retrieval after sync
                        taskFeature : 'task'
                    },
                    syncOptions : {
                        syncIdField : 'taskBarFeature'
                    }
                },
                ...data.wrapperChildren
            ],
            style : {
                transform : `translate(${data.left}px, ${data.top}px)`,
                // DomHelper appends px to dimensions when using numbers
                height    : data.height,
                width     : data.width,
                zIndex    : data.zIndex
            },
            dataset : {
                taskId : data.taskId
            },
            // Will not be part of DOM, but attached to the element
            elementData : data,
            // Options for this level of sync, lower levels can have their own
            syncOptions : {
                syncIdField      : 'taskFeature',
                // Remove instead of release when a feature is disabled
                releaseThreshold : 0
            }
        };

        me.gantt.trigger('beforeRenderTask', { renderData : data, domConfig : config });

        // Store DOM configs
        me.rowMap.set(row, [config, ...data.extraConfigs]);
    }

    // Called when the current row rendering "pass" is complete, sync collected configs to DOM
    onRenderDone() {
        const
            { gantt } = this,
            configs   = Array.from(this.rowMap.values()).flat(); // TODO: flat converted by babel?

        DomSync.sync({
            domConfig : {
                onlyChildren : true,
                children     : configs
            },
            targetElement : gantt.foregroundCanvas,
            syncIdField   : 'taskId',

            // Called by DomHelper when it creates, releases or reuses elements
            callback({ action, domConfig, lastDomConfig, element }) {
                // If element is a task wrap, trigger appropriate events
                if (action !== 'none' && domConfig && domConfig.className && domConfig.className[gantt.eventCls + '-wrap']) {
                    const
                        // Some actions are considered first a release and then a render (reusing another element).
                        // This gives clients code a chance to clean up before reusing an element
                        isRelease = releaseEventActions[action],
                        isRender  = renderEventActions[action];

                    // If we are reusing an element that was previously released we should not trigger again
                    if (isRelease && lastDomConfig) {
                        const
                            event = {
                                renderData : lastDomConfig.elementData,
                                taskRecord : lastDomConfig.elementData.taskRecord,
                                element
                            };

                        // This event is documented on Gantt
                        gantt.trigger('releaseTask', event);
                    }

                    if (isRender) {
                        const
                            event = {
                                renderData : domConfig.elementData,
                                taskRecord : domConfig.elementData.taskRecord,
                                element
                            };

                        event.reusingElement = action === 'reuseElement';
                        // This event is documented on Gantt
                        gantt.trigger('renderTask', event);
                    }
                }
            }
        });
    }

    // Redraws a single task by rerendering its cell
    redraw(taskRecord) {
        const row = this.gantt.rowManager.getRowFor(taskRecord);

        if (row) {
            const cell = row.getCell(this.gantt.timeAxisColumn.id);
            if (cell) {
                // Will call `renderer()` above to update DOM config
                row.renderCell(cell);
                // Update DOM
                this.onRenderDone();
            }
        }
    }

    //endregion
}
