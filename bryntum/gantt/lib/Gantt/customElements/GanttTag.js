import Gantt from '../view/Gantt.js';
import ProjectModel from '../model/ProjectModel.js';
import { setupFocusListeners } from '../../Core/GlobalEvents.js';

//TODO: If we want to improve on this, add settings as attributes, replace data-field with field etc.

/**
 * @module Gantt/customElements/GanttTag
 */

/**
 * Import this file to be able to use the tag **&lt;bryntum-gantt&gt;** to create a gantt. This is more of a
 * proof of concept than a ready to use class. Dataset from **&lt;bryntum-gantt&gt;** tag is
 * applied to gantt config, which means, that you can pass any documented config there, not only
 * demonstrated here. Dataset attributes are translated as follows:
 *
 *  * data-view-preset -> viewPreset
 *  * data-start-date -> startDate
 *
 *  etc.
 *
 * There is also a special attribute `data-theme` to set theme on the gantt component. If omitted, `stockholm` theme is
 * set by default.
 *
 * ## Example
 * ```
 * &lt;bryntum-gantt data-view-preset="weekAndDay" data-start-date="2018-04-02" data-end-date="2018-04-09"&gt;
 *      &lt;column data-type="name"&gt;Name&lt;/column&gt;
 *      &lt;project data-load-url="/projectdata"&gt;Name&lt;/project&gt;
 *      &lt;feature data-name="nonWorkingTime"&gt;&lt;/feature&gt;
 *      &lt;feature data-name="timeRanges" data-show-current-timeline="true"&gt;&lt;/feature&gt;
 * &lt;/bryntum-gantt&gt;
 * ```
 */
export default class GanttTag extends (window.customElements ? HTMLElement : Object) {
    constructor() {
        super();

        const
            me        = this,
            columns   = [],
            features  = {};

        let project;

        // create columns and data
        for (let tag of me.children) {
            if (tag.tagName === 'COLUMN') {
                const
                    width  = parseInt(tag.dataset.width),
                    flex   = parseInt(tag.dataset.flex),
                    column = {
                        field : tag.dataset.field,
                        text  : tag.innerHTML,
                        type  : tag.dataset.type
                    };

                if (width) column.width = width;
                else if (flex) column.flex = flex;
                else column.flex = 1;

                columns.push(column);
            }
            else if (tag.tagName === 'PROJECT') {
                project = new ProjectModel({
                    transport : {
                        load : {
                            url : tag.dataset.loadUrl
                        }
                    }
                });
            }
            else if (tag.tagName === 'FEATURE') {
                const
                    name   = tag.dataset.name,
                    config = Object.assign({}, tag.dataset);

                delete config.name;

                if (Object.keys(config).length) {
                    features[name] = config;
                }
                else {
                    features[name] = tag.textContent !== 'false';
                }
            }
        }

        const
            config     = Object.assign({}, me.dataset),
            theme      = config.theme || 'stockholm',
            // go over to the dark side
            shadowRoot = this.attachShadow({ mode : 'open' }),
            // include css and target div in shadow dom
            link       = document.createElement('link');

        delete config.theme;

        link.rel = 'stylesheet';
        link.href = `../../build/gantt.${theme}.css`;

        link.onload = () => {
            const div = document.createElement('div');

            div.id = 'container';
            div.style.width = '100%';
            div.style.height = '100%';

            shadowRoot.appendChild(div);

            // Listen to focus events on shadow root to handle focus inside the shadow dom
            setupFocusListeners(shadowRoot);

            Object.assign(config, {
                appendTo : div,
                columns  : columns,
                features,
                project
            });

            // render as usual
            const gantt = new Gantt(config);

            if (project instanceof ProjectModel) {
                project.load();
            }

            // for testing, set first gantt as global variable
            if (!window.gantt) window.gantt = gantt;
        };

        shadowRoot.appendChild(link);
    }
}

// Try-catch to make trial work
try {
    window.customElements && window.customElements.define('bryntum-gantt', GanttTag);
}
catch (error) {

}
