import DateHelper from '../../../Core/helper/DateHelper.js';
import GridExportDialog from '../../../Grid/view/export/ExportDialog.js';
import { ScheduleRange } from '../../feature/export/Utils.js';
import '../../view/export/field/ScheduleRangeCombo.js';
import Field from '../../../Core/widget/Field.js';
import TimeAxisColumn from '../../column/TimeAxisColumn.js';

/**
 * @module Scheduler/view/export/SchedulerExportDialog
 */

/**
 * Similar to dialog in Grid, but with few extra fields specific to scheduler.
 * @extends Grid/view/export/ExportDialog
 */
export default class SchedulerExportDialog extends GridExportDialog {
    static get $name() {
        return 'SchedulerExportDialog';
    }

    static get defaultConfig() {
        return {
            scheduleRange : 'completeview'
        };
    }

    onLocaleChange() {
        const
            labelWidth = this.L('labelWidth');

        this.width = this.L('L{width}');

        this.items.forEach(widget => {
            if (widget instanceof Field) {
                widget.labelWidth = labelWidth;
            }
            else if (widget.ref === 'rangeFieldsContainer') {
                widget.items[0].width = labelWidth;
            }
        });
    }

    get fieldProperties() {
        return [
            'scheduleRange',
            ...super.fieldProperties
        ];
    }

    buildDialogItems(config) {
        const
            me                = this,
            { client }        = config,
            { scheduleRange } = me.getDefaultFieldValues(config),
            items             = super.buildDialogItems(config),
            labelWidth        = me.L('labelWidth');

        me.columnsStore = client.columns.chain(record => record.isLeaf && !(record instanceof TimeAxisColumn));

        const columnsField = items.find(item => item.ref === 'columnsField');
        columnsField.store = me.columnsStore;
        columnsField.value = me.columnsStore.allRecords;

        items.splice(1, 0,
            {
                labelWidth,
                type        : 'schedulerangecombo',
                ref         : 'scheduleRangeField',
                label       : 'L{Schedule range}',
                localeClass : me,
                value       : scheduleRange,
                onChange({ value }) {
                    const
                        hidden    = value !== ScheduleRange.daterange,
                        widgetMap = this.owner.widgetMap;

                    widgetMap.rangeStartField.hidden = widgetMap.rangeEndField.hidden = hidden;
                }
            },
            {
                type  : 'container',
                ref   : 'rangeFieldsContainer',
                flex  : '1 0 100%',
                items : [
                    {
                        // Filler widget to align date fields
                        type  : 'widget',
                        width : labelWidth
                    },
                    {
                        type        : 'datefield',
                        ref         : 'rangeStartField',
                        label       : 'L{Export from}',
                        hidden      : true,
                        flex        : '1 0 25%',
                        localeClass : me,
                        value       : client.startDate,
                        max         : DateHelper.max(client.startDate, DateHelper.add(client.endDate, -1, 'd')),
                        onChange({ value }) {
                            this.owner.widgetMap.rangeEndField.min = DateHelper.add(value, 1, 'd');
                        }
                    },
                    {
                        type        : 'datefield',
                        ref         : 'rangeEndField',
                        label       : 'L{Export to}',
                        hidden      : true,
                        flex        : '1 0 25%',
                        localeClass : me,
                        value       : client.endDate,
                        min         : DateHelper.min(client.endDate, DateHelper.add(client.startDate, 1, 'd')),
                        onChange({ value }) {
                            this.owner.widgetMap.rangeStartField.max = DateHelper.add(value, -1, 'd');
                        }
                    }
                ]
            }
        );

        return items;
    }
}
