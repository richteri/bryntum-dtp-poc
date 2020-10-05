/**
 * @author Saki
 * @date 2019-12-14 20:28:56
 * @Last Modified by: Saki
 * @Last Modified time: 2019-12-14 20:38:52
 * 
 * Taken from the vanilla example. Adjusted imports.
 */

import { BryntumWidgetAdapterRegister, Combo } from 'bryntum-gantt';

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

// eof
