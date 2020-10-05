import Grid from '../../../lib/Grid/view/Grid.js';
import BryntumWidgetAdapterRegister from '../../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module FilesTab
 */

/**
 * @internal
 */
export default class FilesTab extends Grid {

    static get type() {
        return 'filestab';
    }

    static get defaultConfig() {
        return {
            title    : 'Files',
            defaults : {
                labelWidth : 200
            },
            columns : [{
                text     : 'Files attached to task',
                field    : 'name',
                type     : 'template',
                template : data => `<i class="b-fa b-fa-fw b-fa-${data.record.data.icon}"></i>${data.record.data.name}`
            }]
        };
    }

    loadEvent(eventRecord) {
        let files = [];

        for (let i = 0; i < Math.random() * 10; i++) {
            const nbr = Math.round(Math.random() * 5);

            switch (nbr) {
                case 1:
                    files.push({
                        name : `Image${nbr}.pdf`,
                        icon : 'image'
                    });
                    break;
                case 2:
                    files.push({
                        name : `Charts${nbr}.pdf`,
                        icon : 'chart-pie'
                    });
                    break;
                case 3:
                    files.push({
                        name : `Spreadsheet${nbr}.pdf`,
                        icon : 'file-excel'
                    });
                    break;
                case 4:
                    files.push({
                        name : `Document${nbr}.pdf`,
                        icon : 'file-word'
                    });
                    break;
                case 5:
                    files.push({
                        name : `Report${nbr}.pdf`,
                        icon : 'user-chart'
                    });
                    break;
            }
        }

        this.store.data = files;
    }
}

BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab);
