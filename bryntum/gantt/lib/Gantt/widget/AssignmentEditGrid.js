import Container from '../../Core/widget/Container.js';
import WidgetHelper from '../../Core/helper/WidgetHelper.js';
import ResourceModel from '../model/ResourceModel.js';

export default class AssignmentEditGrid extends Container {
    //region Config

    static get $name() {
        return 'AssignmentEditGrid';
    }

    static get defaultConfig() {
        return {
            id : 'assignmenteditgrid',

            cls : 'b-assignmenteditgrid',

            items : [{
                type : 'button',
                cls  : 'b-add-button green',
                icon : 'plus',
                id   : 'assignmenteditgrid-add'
            }, {
                type     : 'button',
                cls      : 'b-remove-button red',
                icon     : 'trash',
                disabled : true,
                id       : 'assignmenteditgrid-remove'
            }, {
                type        : 'grid',
                id          : 'assignmenteditgrid-grid',
                storeConfig : {
                    modelClass : ResourceModel
                },
                columns : [{
                    field  : 'name',
                    text   : 'L{Name}',
                    flex   : 1,
                    editor : {
                        type       : 'combo',
                        textField  : 'name',
                        valueField : 'id'
                    }
                }, {
                    field : 'units',
                    text  : 'L{Units}',
                    width : 80
                }]
            }]
        };
    }

    //endregion

    //region Init

    afterConfigure() {
        super.afterConfigure();

        const me = this,
            addButton = me.addButton = WidgetHelper.getById('assignmenteditgrid-add'),
            removeButton = me.removeButton = WidgetHelper.getById('assignmenteditgrid-remove'),
            grid = me.grid = WidgetHelper.getById('assignmenteditgrid-grid').grid;

        addButton && addButton.on('click', me.onAddClick, me);
        removeButton && removeButton.on('click', me.onRemoveClick, me);

        grid.on({
            rowselect : () => removeButton.enable()
        });
    }

    //endregion
}
