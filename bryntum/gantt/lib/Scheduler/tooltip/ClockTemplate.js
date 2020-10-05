import Base from '../../Core/Base.js';
import DateHelper from '../../Core/helper/DateHelper.js';

//import styles from '../../../resources/sass/tooltip/clocktemplate.scss';

/**
 * @module Scheduler/tooltip/ClockTemplate
 */

/**
 * A template showing a clock, it consumes an object containing a date and a text
 * @private
 */
export default class ClockTemplate extends Base {
    static get defaultConfig() {
        return {
            minuteHeight : 8,
            minuteTop    : 2,
            hourHeight   : 8,
            hourTop      : 2,
            handLeft     : 10,
            div          : document.createElement('div'),
            scheduler    : null, // should be passed to the constructor
            // `b-sch-clock-day` for calendar icon
            // `b-sch-clock-hour` for clock icon
            template     : function(data) {
                return `<div class="b-sch-clockwrap b-sch-clock-${this.mode} ${data.cls || ''}">
                    <div class="b-sch-clock">
                        <div class="b-sch-hour-indicator">${DateHelper.format(data.date, 'MMM')}</div>
                        <div class="b-sch-minute-indicator">${DateHelper.format(data.date, 'D')}</div>
                        <div class="b-sch-clock-dot"></div>
                    </div>
                    <span class="b-sch-clock-text">${data.text}</span>
                </div>`;
            }
        };
    }

    construct(config) {
        super.construct(config);

        //<debug>
        if (!this.scheduler) {
            throw new Error('`scheduler` config has to be specified for the clock template');
        }
        //</debug>
    }

    generateContent(data) {
        const
            me   = this,
            date = data.date,
            html = me.template(data),
            div  = me.div;

        div.innerHTML = html;
        me.updateDateIndicator(div, date);

        return div.innerHTML;
    }

    updateDateIndicator(el, date) {
        const
            hourIndicatorEl   = el.querySelector('.b-sch-hour-indicator'),
            minuteIndicatorEl = el.querySelector('.b-sch-minute-indicator');

        if (date && hourIndicatorEl && minuteIndicatorEl) {
            if (this.mode === 'hour') {
                hourIndicatorEl.style.transform   = `rotate(${(date.getHours() % 12) * 30}deg)`;
                minuteIndicatorEl.style.transform = `rotate(${date.getMinutes() * 6}deg)`;
            } else {
                hourIndicatorEl.style.transform   = 'none';
                minuteIndicatorEl.style.transform = 'none';
            }
        }
    }

    // `day` mode for calendar icon
    // `hour` mode for clock icon
    get mode() {
        const
            unitLessThanDay        = DateHelper.compareUnits(this.scheduler.timeAxisViewModel.timeResolution.unit, 'day') < 0,
            formatContainsHourInfo = DateHelper.formatContainsHourInfo(this.scheduler.displayDateFormat);

        return unitLessThanDay && formatContainsHourInfo ? 'hour' : 'day';
    }

    set template(template) {
        this._template = template;
    }

    /**
     * Get the clock template, which accepts an object of format { date, text }
     * @returns {function(*): string}
     */
    get template() {
        return this._template;
    }
}
