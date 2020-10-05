/* eslint-disable no-unused-vars */
import Grid from '../../../lib/Grid/view/Grid.js';
import '../../../lib/Grid/column/DateColumn.js';
import BryntumWidgetAdapterRegister from '../../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

export default class TimeRangesGrid extends Grid {

    static get defaultConfig() {
        return {
            features : {
                stripe : true,
                sort   : 'startDate'
            },

            columns : [
                {
                    text  : 'Time ranges',
                    flex  : 1,
                    field : 'name'
                },
                {
                    type  : 'date',
                    text  : 'Start Date',
                    width : 110,
                    align : 'right',
                    field : 'startDate'
                },
                {
                    type          : 'number',
                    text          : 'Duration',
                    width         : 100,
                    field         : 'duration',
                    min           : 0,
                    instantUpdate : true,
                    renderer      : data => `${data.record.duration} d`
                }]
        };
    }

    construct(config) {
        super.construct(config);

    }
};

BryntumWidgetAdapterRegister.register('timerangesgrid', TimeRangesGrid);
