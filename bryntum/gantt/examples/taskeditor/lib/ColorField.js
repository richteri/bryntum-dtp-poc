import BryntumWidgetAdapterRegister from '../../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import Combo from '../../../lib/Core/widget/Combo.js';

const baseColors = [
    'maroon', 'red', 'orange', 'yellow',
    'olive', 'green', 'purple', 'fuchsia',
    'lime', 'teal', 'aqua', 'blue', 'navy',
    'black', 'gray', 'silver', 'white'
];

export default class ColorField extends Combo {
    static get type() {
        return 'colorfield';
    }

    static get defaultConfig() {
        return {
            clearable : true,
            items     : baseColors,
            picker    : {
                cls     : 'b-color-picker-container',
                itemCls : 'b-color-picker-item',
                itemTpl : item => `<div style="background-color:${item.id}"></div>`
            }
        };
    }
}

BryntumWidgetAdapterRegister.register(ColorField.type, ColorField);
