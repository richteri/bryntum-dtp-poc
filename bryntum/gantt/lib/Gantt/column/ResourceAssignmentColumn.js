import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import AssignmentField from '../widget/AssignmentField.js';
import ChipView from '../../Core/widget/ChipView.js';
import EventHelper from '../../Core/helper/EventHelper.js';

const defaultUserImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA3CAYAAABQOymxAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjYwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41NTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTgtMDMtMTBUMTE6MDM6NTc8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy43PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpEgCIGAAADbUlEQVRoBe2aW08TQRTH/yVchVCg3Kyl1EAEg6VBjdpoor74ZUz8Nn4UIyHGy4NGLtEHoiLhBQpUkWAIt8itnkMt3SVud2b3DL0xSdPZnTNzzm8uZ87ubCCTyTwD8JR+1+hXyWme4J4HCPg7ZSodNjeQ8wycyV1Vw39NNUBaGWutF6bzh6Rg5XdeC8+t+nog3JK/ZzpnHDi9A0xNAUdH7ijt7cDjW+5yfiSMruHxD8Durr550Shw25AbNQL8hxhfvNIHtdZooWn+5J71jkzeiNMaf+PfuO1tYJo3TOEkDvx1WW29qnCkUsCBiqCGjDjw3JyGdgXRt5MKQhoiosA/PDgoN1u3ttwk9MpFgWdm9JSrSv/cU5V0lxMF3t93V+hFYpn8glQSBZYy6mw7ktF+WQCf7QA/1xfAfnovEPBT27lurWDEXxYjHAo5d4ZuSVkAR4K6WM7yZQHsbL5+yQWwfp/la5hyWpIv3URHOCi41vLdCEgaKdkWhoetZpZmXhT4crM8ZEODbJuiwGxaT4+sgfG4bHviwPcFDawh66JtJQ7M5tXVyRg5OCjTjrUV8RHmxmMxqwrv+Rv0ulY6GQGO92dPFPwY293tp7ZzXSPArK6vz1mpWwkHMA9G3aS8lRsDTlwFvD7W9fZ6g1GpZQyYlScSKibYZbiTkiP2e5JXRoH76XAsEtEzN5nUk9eVNgrMxjRrRl9twpHV2Q4xcpjGSn7RidrSErC+DuzQkalq6uwE+CGEt7YgOS/pJArMZ8Hz9OkIH4TxO2o/r1c5yuI4urUVGKPo7ZIQuW/ghTUgnc6OpB9ANx7uAN6bh4aAkI9IzjNwahNYXATWCPg8E3tx3rYGBryBawMz6MICsEn/x8fniWrXxeC81u+OAY32ooJXysB8MPh5Njt1Vb7XKKhVsJDXeVcXcEfx5YMrMB/cfSFHxOv0QPp0WhC8kYaZ9/zRWOFGCwJ/oqm7upr1uIWbKZ3SpiZ6hqanrBGHWP6/wLPkjHhEeXsp18TrOxwGrl+xE9iAD6ns3XTWIdnFyveKj2kekmPLJRvwy/fAnuBpe05Jsf87OoBHN7NWnMbSEx8rE5YxNzaA1/8+xzgZ4clv9A3kSrHHwbx+js9PRrgaYLk7OTI8ndLm+7f4GjjWrypg7vIL4OJPPLMWVN0I/wWcn9aXj4AzhgAAAABJRU5ErkJggg==';

/**
 * @module Gantt/column/ResourceAssignmentColumn
 */

/**
 * Column allowing resource manipulation (assignment/unassignment/units changing) on a task. In the column cells,
 * assignments are either shown as badges or avatars. To show avatars, set {@link #config-showAvatars} to true. When showing avatars, you have to provide a
 * {@link Gantt.view.Gantt#config-resourceImageFolderPath} on your Gantt panel pointing to where resource images are located. Set the resource image filename
 * in the `image` field of the resource data.
 * A special {@link Gantt.view.Gantt#config-defaultResourceImageName} is used when a resource has no name, or its image cannot be loaded
 *
 * Default editor is a {@link Gantt.widget.AssignmentField AssignmentField}.
 *
 * @extends Grid/column/Column
 * @classType resourceassignment
 */
export default class ResourceAssignmentColumn extends Column {
    static get type() {
        return 'resourceassignment';
    }

    static get isGanttColumn() {
        return true;
    }

    static get fields() {
        return [
            /**
             * True to show a resource avatar for every assignment. Note that you also have to provide a {@link Gantt.view.Gantt#config-resourceImageFolderPath} for where to load images from.
             * @config {Boolean} showAvatars
             * @category Common
             */
            'showAvatars',

            'sideMargin',
            'imageSize'
        ];
    }

    static get defaults() {
        return {
            field         : 'assignments',
            instantUpdate : false,
            text          : 'L{Assigned Resources}',
            width         : 250,
            cellCls       : 'b-resourceassignment-cell',
            showAvatars   : false,
            imageSize     : 30,
            sideMargin    : 20
        };
    }

    construct() {
        const me = this;

        super.construct(...arguments);

        if (me.showAvatars) {

            EventHelper.on({
                element : me.grid.element,
                error   : me.onError,
                thisObj : me,
                capture : true
            });

            Object.assign(me, {
                repaintOnResize : true,
                htmlEncode      : false,
                autoSyncHtml    : true
            });

            if (!me.grid.resourceImageFolderPath) {
                throw new Error('Must provide a resourceImageFolderPath where resource images are located');
            }

            me.renderer = me.rendererWithAvatars;
        }

        me.grid.on({
            startCellEdit  : me.onStartCellEdit,
            finishCellEdit : me.onDoneCellEdit,
            cancelCellEdit : me.onDoneCellEdit,
            thisObj        : me
        });

        me.grid.resourceStore.on({
            name    : 'resourceStore',
            update  : me.onResourceUpdate,
            thisObj : me
        });
    }

    get defaultEditor() {
        return {
            type : AssignmentField.type
        };
    }

    onStartCellEdit({ editorContext : { record, column } }) {
        const me = this;

        if (column === me) {
            me.editor.projectEvent = record;

            this.detachListeners('editorStore');

            me.editor.store.on({
                name           : 'editorStore',
                changesApplied : me.onEditorChangesApplied,
                thisObj        : me
            });
        }
    }

    onDoneCellEdit() {
        this.detachListeners('editorStore');
    }

    onEditorChangesApplied() {
        const
            me          = this,
            cellElement = me.grid.getCell({ id : me.editor.projectEvent.id, columnId : me.id });

        if (cellElement) {
            me.renderer({ value : me.editor.projectEvent.assignments, cellElement });
        }
    }

    onResourceUpdate() {
        this.grid.refreshColumn(this);
    }

    get chipView() {
        if (!this._chipView) {
            this._chipView = new ChipView({
                cls            : 'b-assignment-chipview',
                itemsFocusable : false,
                closable       : false,
                itemTpl        : this.itemTpl,
                store          : {},
                scrollable     : {
                    overflowX : 'hidden-scroll'
                }
            });
            // The List class only refreshes itself when visible, so
            // since this is an offscreen, rendering element
            // we have to fake visibility.
            Object.defineProperty(this.chipView, 'isVisible', {
                get() {
                    return true;
                }
            });
        }
        return this._chipView;
    }

    /**
     * A function which produces the content to put in the resource assignment cell.
     * May be overridden in subclasses, or injected into the column
     * to customize the Chip content.
     *
     * Defaults to returning `${assignment.resourceName} ${assignment.units}%`
     *
     * The following parameters are passed:
     *  - **assignment** : `{@link Gantt.model.AssignmentModel AssignmentModel}` The assignment
     *  - **idx** : `Number` The index - zero based.
     * @config {Function}
     */
    itemTpl(assignment, i) {
        return `${assignment.resourceName} ${assignment.units}%`;
    }

    renderer({ cellElement, value, isExport }) {
        if (isExport) {
            return value;
        }
        else {
            const { chipView } = this;

            chipView.store.storage.replaceValues({
                values : value.filter(a => a.resource).sort((lhs, rhs) => lhs.resourceName.localeCompare(rhs.resourceName)),
                silent : true
            });

            chipView.refresh();
            const chipCloneElement = chipView.element.cloneNode(true);
            chipCloneElement.removeAttribute('id');

            cellElement.innerHTML = '<div class="b-assignment-chipview-wrap"></div>';
            cellElement.firstElementChild.appendChild(chipCloneElement);
        }
    }

    rendererWithAvatars({ value, isExport }) {
        if (isExport) {
            return value;
        }

        const
            me            = this,
            nbrVisible    = Math.floor((me.width - me.sideMargin) / (me.imageSize + 2)),
            overflowCount = value.length > nbrVisible ? value.length - nbrVisible : 0;

        return '<div class="b-resource-avatar-container">' + Array.from(value).map((assignment, i) => {
            const { resource } = assignment;

            if (resource && i < nbrVisible) {
                const
                    isLastOverflowing = overflowCount > 0 && i === nbrVisible - 1,
                    imgMarkup         = me.renderImage({
                        resource,
                        assignment,
                        overflowCount : isLastOverflowing ? overflowCount : 0
                    });

                if (isLastOverflowing) {
                    return `<div class="b-overflow-img">${imgMarkup}<span class="b-overflow-count">+${overflowCount}</span></div>`;
                }

                return imgMarkup;
            }
        }).join('') + '</div>';
    }

    renderImage({ resource, assignment, overflowCount }) {
        const tooltip = `${resource.name} ${assignment.units}%${overflowCount ? ` (+${overflowCount} ${this.L('L{more resources}')})` : ''}`;

        return `<img data-btip-scroll-action="realign" data-btip="${tooltip}" class="b-resource-avatar" src="${resource.image ? this.grid.resourceImageFolderPath + resource.image : this.defaultAvatar}">`;
    }

    // Show the empty image if resource image cannot be loaded
    onError(event) {
        const img = event.target;

        if (img.classList.contains('b-resource-avatar')) {
            // If default avatar could not be found, fall back to our data URI
            if (img.getAttribute('src').endsWith(this.defaultAvatar)) {
                img.src = defaultUserImage;
            }
            else {
                img.src = this.defaultAvatar;
            }
        }
    }

    get defaultAvatar() {
        return this.grid.defaultResourceImageName ? this.grid.resourceImageFolderPath + this.grid.defaultResourceImageName : defaultUserImage;
    }
}

ColumnStore.registerColumnType(ResourceAssignmentColumn);
