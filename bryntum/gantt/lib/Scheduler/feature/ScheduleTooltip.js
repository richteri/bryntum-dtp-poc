import InstancePlugin from '../../Core/mixin/InstancePlugin.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Tooltip from '../../Core/widget/Tooltip.js';
import ClockTemplate from '../tooltip/ClockTemplate.js';
import EventHelper from '../../Core/helper/EventHelper.js';

/**
 * @module Scheduler/feature/ScheduleTooltip
 */

/**
 * Feature that displays a tooltip containing the time at the mouse position when hovering empty parts of the schedule.
 * To hide the schedule tooltip, just disable this feature:
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleTooltip : false
 *     }
 * });
 * ```
 *
 * You can also output a message along with the default time indicator (to indicate resource availability etc)
 *
 * ```javascript
 * const scheduler = new Scheduler({
 *    features : {
 *       scheduleTooltip : {
 *           getText(date, event, resource) {
 *               return 'Hovering ' + resource.name;
 *           }
 *       }
 *   }
 * });
 * ```
 *
 * To take full control over the markup shown in the tooltip you can override the {@link #function-generateTipContent} method:
 * ```
 * const scheduler = new Scheduler({
 *     features : {
 *         scheduleTooltip : {
 *             generateTipContent({ date, event, resourceRecord }) {
 *                 return `
 *                     <dl>
 *                         <dt>Date</dt><dd>${date}</dd>
 *                         <dt>Resource</dt><dd>${resourceRecord.name}</dd>
 *                     </dl>
 *                 `;
 *             }
 *         }
 *     }
 * });
 * @extends Core/mixin/InstancePlugin
 * @demo Scheduler/basic
 * @externalexample scheduler/ScheduleTooltip.js
 */
export default class ScheduleTooltip extends InstancePlugin {
    //region Config

    static get $name() {
        return 'ScheduleTooltip';
    }

    static get defaultConfig() {
        return {
            messageTemplate : data => `<div class="b-sch-hovertip-msg">${data.message}</div>`
        };
    }

    // Plugin configuration. This plugin chains some of the functions in Grid.
    static get pluginConfig() {
        return {
            chain : ['render']
        };
    }

    //endregion

    //region Init

    /**
     * Called when scheduler is rendered. Sets up drag and drop and hover tooltip.
     * @private
     */
    render() {
        const
            me        = this,
            scheduler = me.client;

        // TODO: render should not ever be called twice.
        if (me.hoverTip) {
            me.hoverTip.destroy();
        }

        let reshowListener;

        const tip = me.hoverTip = new Tooltip({
            id                       : `${scheduler.id}-schedule-tip`,
            cls                      : 'b-sch-scheduletip',
            allowOver                : true,
            hoverDelay               : 0,
            hideDelay                : 100,
            showOnHover              : true,
            forElement               : scheduler.timeAxisSubGridElement,
            anchorToTarget           : false,
            trackMouse               : true,
            updateContentOnMouseMove : true,
            forSelector              : '.b-schedulerbase:not(.b-animating):not(.b-dragging-event):not(.b-dragcreating) .b-grid-body-container:not(.b-scrolling) .b-timeline-subgrid:not(.b-scrolling) > :not(.b-sch-foreground-canvas):not(.b-group-footer):not(.b-group-row) *',
            // Do not constrain at all, want it to be able to go outside of the viewport to not get in the way
            constrainTo              : null,
            getHtml                  : me.getHoverTipHtml.bind(me),
            onDocumentMouseDown(event) {
                // Click on the scheduler hides until the very next
                // non-button-pressed mouse move!
                if (tip.forElement.contains(event.event.target)) {
                    reshowListener = EventHelper.on({
                        element   : scheduler.timeAxisSubGridElement,
                        mousemove : e => tip.internalOnPointerOver(e),
                        capture   : true
                    });
                }

                const hideAnimation = tip.hideAnimation;
                tip.hideAnimation = false;
                tip.constructor.prototype.onDocumentMouseDown.call(tip, event);
                tip.hideAnimation = hideAnimation;
            },
            listeners : {
                pointerover : ({ event }) => {
                    const buttonsPressed = 'buttons' in event ? event.buttons > 0
                        : event.which > 0; // fallback for Safari which doesn't support 'buttons'

                    // This is the non-button-pressed mousemove
                    // after the document mousedown
                    if (!buttonsPressed && reshowListener) {
                        reshowListener();
                    }

                    // Never any tooltip while interaction is ongoing and a mouse button is pressed
                    return !me.disabled && !buttonsPressed;
                }
            }
        });

        me.clockTemplate = new ClockTemplate({
            scheduler
        });
    }

    doDestroy() {
        this.destroyProperties('clockTemplate', 'hoverTip');
        super.doDestroy();
    }

    //endregion

    //region Contents

    /**
     * @deprecated Use {@link #function-generateTipContent} instead.
     * @private
     * Gets html to display in hover tooltip (tooltip displayed on empty parts of scheduler)
     */
    getHoverTipHtml({ tip, event }) {
        const
            me        = this,
            scheduler = me.client,
            date      = event && scheduler.getDateFromDomEvent(event, 'floor', true);

        let html      = me.lastHtml;

        if (date) {
            const resourceRecord = scheduler.resolveResourceRecord(event);

            if (date - me.lastTime !== 0 || resourceRecord !== me.lastResource) {
                me.lastResource = resourceRecord;
                html = me.lastHtml = me.generateTipContent({ date, event, resourceRecord });
            }
        }
        else {
            tip.hide();
            me.lastTime = null;
            me.lastResource = null;
        }

        return html;
    }

    /**
     * Called as mouse pointer is moved over a new resource or time block. You can override this to show
     * custom HTML in the tooltip.
     * @param {Object} context
     * @param {Date} context.date The date of the hovered point
     * @param {Event} context.event The DOM event that triggered this tooltip to show
     * @param {Scheduler.model.ResourceModel} context.resourceRecord The resource record
     */
    generateTipContent({ date, event, resourceRecord }) {
        const
            me          = this,
            clockHtml   = me.clockTemplate.generateContent({
                date : date,
                text : me.client.getFormattedDate(date)
            }),
            messageHtml = me.messageTemplate({
                message : me.getText(date, event, resourceRecord) || ''
            });

        me.lastTime = date;

        return clockHtml + messageHtml;
    }

    /**
     * Override this to render custom text to default hover tip
     * @param {Date} date
     * @param {Event} event Browser event
     * @param {Scheduler.model.ResourceModel} resourceRecord The resource record
     * @return {String}
     */
    getText(date, event, resourceRecord) {

    }

    //endregion
}

// TODO: Refactor SASS so thet auto-generated class name of 'b-' + cls.name.toLowerCase() can be used.
ScheduleTooltip.featureClass = 'b-scheduletip';

GridFeatureManager.registerFeature(ScheduleTooltip, true, 'Scheduler');
