import Rectangle from '../../../../Core/helper/util/Rectangle.js';
import DomHelper from '../../../../Core/helper/DomHelper.js';

/**
 * This mixin overrides event elements handling in similar scheduler mixin. Uses correct element class names and
 * resolves elements in gantt-way.
 * @private
 */
export default base => class GanttExporterMixin extends base {
    async prepareComponent(config) {
        await super.prepareComponent(config);

        const
            me             = this,
            // Clear cloned gantt element from task elements
            fgCanvasEl     = me.element.querySelector('.b-sch-foreground-canvas');

        DomHelper.removeEachSelector(fgCanvasEl, '.b-gantt-task-wrap');
        DomHelper.removeEachSelector(fgCanvasEl, '.b-released');
    }

    collectEvents(rows, config) {
        const
            me         = this,
            addedRows  = rows.length,
            { client } = config,
            normalRows = me.exportMeta.subGrids.normal.rows;

        rows.forEach((row, index) => {
            const
                rowConfig = normalRows[normalRows.length - addedRows + index],
                event     = client.store.getAt(row.dataIndex),
                eventsMap = rowConfig[3];

            if (event.isScheduled) {
                const el = client.getElementFromTaskRecord(event, false);

                if (el && !eventsMap.has(event.id)) {
                    eventsMap.set(event.id, [el.outerHTML, Rectangle.from(el, el.offsetParent)]);
                }
            }
        });
    }
};
