import AbstractTimeRanges from '../../Scheduler/feature/AbstractTimeRanges.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import DateHelper from '../../Core/helper/DateHelper.js';

/**
 * @module SchedulerPro/feature/ProNonWorkingTime
 */

/**
 * Feature that allows styling of weekends (and other non working time) by adding timeRanges for those days.
 *
 * The feature is like {@link Scheduler/feature/NonWorkingTime} but intended to work with {@link SchedulerPro/view/ProScheduler}
 * and use project's {@link SchedulerPro/model/ProCalendarModel calendar} to obtain non-working time
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/AbstractTimeRanges
 */
export default class ProNonWorkingTime extends AbstractTimeRanges {
    //region Default config

    static get defaultConfig() {
        return {
            showHeaderElements : true,

            cls : 'b-sch-nonworkingtime',

            /**
             * Project entity having a calendar to show calendar of or a calendar model instance itself
             * @config {Object}
             * @defualt
             */
            calendar : null
        };
    }

    //endregion

    //region Init & destroy

    construct(client, config) {
        super.construct(client, config);
        this.bindProject(client.project);
    }

    get calendar() {
        return this._calendar;
    }

    set calendar(calendar) {
        const me = this;
        if (calendar !== me._calendar) {
            me._calendar = calendar;
            me.client.isPainted && me.renderRanges();
        }
    }

    doDestroy() {
        this.unbindProject();
        super.doDestroy();
    }

    //endregion

    //region Project

    bindProject(project) {
        const me = this;

        me.calendar = project.getCalendar();

        project.on({
            name : 'project',
            load : () => {
                me.calendar = project.getCalendar();
            },
            thisObj : me
        });

        project.eventStore.on({
            name   : 'project',
            change : ({ record, changes }) => {
                if (record === project && changes.calendar) {
                    me.calendar = project.getCalendar();
                }
            },
            thisObj : me
        });

        project.calendarManagerStore.on({
            name   : 'project',
            change : ({ record }) => {
                if (record === me.calendar && me.client.isPainted) {
                    me.renderRanges();
                }
            },
            thisObj : me
        });
    }

    unbindProject() {
        this.detachListeners('project');
    }

    //endregion

    //region Draw

    renderRanges() {
        const
            me           = this,
            { store }    = me,
            { timeAxis } = me.client;

        if (store && !store.isDestroyed) {
            const shouldPaint = DateHelper.as(timeAxis.unit, 1, 'week') >= 1;

            store.removeAll(true);

            if (me.calendar && shouldPaint) {
                store.add(
                    me.calendar.getDailyHolidaysRanges(timeAxis.startDate, timeAxis.endDate),
                    true
                );
            }
        }

        super.renderRanges();
    }

    //endregion
}

GridFeatureManager.registerFeature(ProNonWorkingTime, true, ['ProScheduler', 'Gantt'], 'nonWorkingTime');
