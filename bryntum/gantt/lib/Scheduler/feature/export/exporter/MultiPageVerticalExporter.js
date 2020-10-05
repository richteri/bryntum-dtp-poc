import GridMultiPageVerticalExporter from '../../../../Grid/feature/export/exporter/MultiPageVerticalExporter.js';
import SchedulerExporterMixin from './SchedulerExporterMixin.js';
import { ScheduleRange } from '../Utils.js';

export default class MultiPageExporter extends SchedulerExporterMixin(GridMultiPageVerticalExporter) {
    async stateNextPage(config) {
        await super.stateNextPage(config);

        this.exportMeta.eventsBoxes.clear();
    }

    async prepareComponent(config) {
        await super.prepareComponent(config);

        // Scheduler exporter mixin can update totalWidth, so we need to adjust pages and scale here again
        if (config.scheduleRange !== ScheduleRange.completeview) {
            this.estimateTotalPages(config);
        }
    }

    positionRows(rows) {
        const
            resources   = [],
            events      = [];

        // In case of variable row height row vertical position is not guaranteed to increase
        // monotonously. Position row manually instead
        rows.forEach(([html, top, height, eventsHtml]) => {
            resources.push(html);
            eventsHtml && Array.from(eventsHtml.entries()).forEach(([key, [html, box]]) => {
                events.push(html);

                // Store event box to render dependencies later
                this.exportMeta.eventsBoxes.set(String(key), box);
            });
        });

        return { resources, events };
    }
}
