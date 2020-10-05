import Combo from '../../Core/widget/Combo.js';
import List from '../../Core/widget/List.js';
import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import Collection from '../../Core/util/Collection.js';
import TextField from '../../Core/widget/TextField.js';
import DateHelper from '../../Core/helper/DateHelper.js';
import LocaleManager from '../../Core/localization/LocaleManager.js';
import Localizable from '../../Core/localization/Localizable.js';

/**
 * @module Gantt/widget/DependencyField
 */

// Enables toggling of link type for each side
const toggleTypes = {
        from : [2, 3, 0, 1],
        to   : [1, 0, 3, 2]
    },
    fromTo      = {
        from : 1,
        to   : 1
    };

// For parsing dependency strings and converting string to type.
// dependencyTypes may be localized in the Gantt class domain
// in which case the Regex is generated from the four local values.
const
    buildDependencySuffixRe = () => new RegExp(`(${dependencyTypes.join('|')})?((?:[+-])\\d+[a-z]*)?`, 'i');
let dependencyTypes    = [
        'SS',
        'SF',
        'FS',
        'FF'
    ],
    dependencySuffixRe = buildDependencySuffixRe();

/**
 * Chooses dependencies, connector sides and lag time for dependencies of a Task.
 *
 * This field can be used as an editor for the {@link Grid.column.Column Column}.
 * It is used as the default editor for the {@link Gantt.column.DependencyColumn DependencyColumn}.
 *
 * The contextual task is the `record` property of this field's {@link Core/widget/Widget#property-owner}.
 *
 * @extends Core/widget/Combo
 *
 * @classType predecessor
 */
export default class DependencyField extends Combo {
    //region Config

    static get $name() {
        return 'DependencyField';
    }

    static get defaultConfig() {
        return {
            listCls : 'b-predecessor-list',

            valueField : 'name',

            displayField : 'name',

            /**
             * Delimiter between dependency ids in the field
             * @config {String}
             * @default
             */
            delimiter : ';',

            /**
             * The other task's relationship with this field's contextual task.
             * This will be `'from'` if we are editing predecessors, and `'to'` if
             * we are editing successors.
             * @config {String}
             */
            otherSide : null,

            /**
             * This field's contextual task's relationship with the other task.
             * This will be `'to'` if we are editing predecessors, and `'from'` if
             * we are editing successors.
             * @config {String}
             */
            ourSide : null
        };
    }

    //endregion

    construct(config) {
        const
            me                     = this,
            { ourSide, otherSide } = config;

        //<debug>
        if (!fromTo[ourSide] || !fromTo[otherSide] || ourSide === otherSide) {
            throw new Error('DependencyField needs "ourSide" and "otherSide" configs of "from" or "to"');
        }
        //</debug>

        me.dependencies = new Collection({
            extraKeys : otherSide
        });
        me.startCollection = new Collection({
            extraKeys : otherSide
        });
        super.construct(config);

        me.delimiterRegEx = new RegExp(`\\s*${me.delimiter}\\s*`);

        // Update when changing locale
        LocaleManager.on({
            locale() {
                dependencyTypes = Localizable().L('L{GanttCommon.dependencyTypes}');
                dependencySuffixRe = buildDependencySuffixRe();
                me.syncInputFieldValue();
            },
            thisObj : me
        });
    }

    internalOnInput() {
        // Avoid combo filtering. That's done from our FilterField
        if (this.isValid) {
            this.clearError();
            TextField.prototype.internalOnInput.call(this);
        }
        else {
            this.setError('Invalid dependency format');
        }
    }

    onInternalKeyDown(keyEvent) {
        const
            { key } = keyEvent;

        // Don't pass Enter down, that selects when ComboBox passes it down
        // to its list. We want default action on Enter.
        // Our list has its own, built in filter field which provides key events.
        if (key !== 'Enter') {
            super.onInternalKeyDown && super.onInternalKeyDown(keyEvent);
        }
        if (this.pickerVisible && key === 'ArrowDown') {
            this.filterField.focus();
        }
    }

    onTriggerClick() {
        if (this.pickerVisible) {
            super.onTriggerClick();
        }
        else {
            this.doFilter(this.filterInput ? this.filterInput.value : null);
        }
    }

    set store(store) {
        const
            me = this;

        // Filter the store to hide the field's Task
        store = store.makeChained(r => !me.owner || !me.owner.record || (r.id !== me.owner.record.id));

        // Gantt TaskStores are TreeStores. We need to flatten.
        store.tree = false;

        super.store = store;
    }

    get store() {
        return super.store;
    }

    createPicker() {
        const
            me               = this,
            myInput          = me.input,
            filterField      = me.filterField = new TextField({
                cls         : 'b-dependency-list-filter',
                owner       : me,
                clearable   : true,
                placeholder : 'Filter',
                triggers    : {
                    filter : {
                        cls   : 'b-icon b-icon-filter',
                        align : 'start'
                    }
                },
                listeners : {
                    input({ value }) {
                        me.input = filterFieldInput;
                        me.filterList(value);
                        me.input = myInput;
                    },
                    clear() {
                        me.input = filterFieldInput;
                        me.filterList();
                        me.input = myInput;
                    }
                }
            }),
            filterFieldInput = me.filterInput = filterField.input,
            result           = new List({
                owner               : me,
                floating            : true,
                scrollAction        : 'realign',
                itemsFocusable      : false,
                activateOnMouseover : true,
                store               : me.store,
                cls                 : me.listCls,
                itemTpl             : me.listItemTpl,
                forElement          : me[me.pickerAlignElement],
                align               : {
                    align    : 't0-b0',
                    axisLock : true,
                    anchor   : me.overlayAnchor,
                    target   : me[me.pickerAlignElement]
                },
                navigator : {
                    keyEventTarget : filterFieldInput,
                    processEvent   : e => {
                        if (e.key === 'Escape') {
                            me.hidePicker();
                        }
                        else {
                            return e;
                        }
                    }
                },
                onItem     : me.onPredecesssorClick,
                maxHeight  : 324,
                minHeight  : 161,
                scrollable : {
                    overflowY : true
                },
                autoShow       : false,
                focusOnHover   : false,
                getItemClasses : function(task) {
                    const
                        result     = List.prototype.getItemClasses.call(this, task),
                        dependency = me.dependencies.getBy(me.otherSide + 'Event', task),
                        cls        = dependency ? ` b-selected b-${dependency.getConnectorString(1).toLowerCase()}` : '';

                    return result + cls;
                }
            });

        filterField.render(result.contentElement);
        return result;
    }

    showPicker(focusPicker) {
        // Ensure this field's Task is filtered out.
        // See our set store which owns the chainedFilterFn.
        this.store.fillFromMaster();

        super.showPicker(focusPicker);
    }

    onPickerShow({ source : picker }) {
        const
            me          = this,
            filterField = me.filterField,
            ourInput    = me.input;

        picker.minWidth = me[me.pickerAlignElement].offsetWidth;
        picker.contentElement.insertBefore(filterField.element, picker.contentElement.firstChild);

        // Combo superclass focuses this.input upon picker show.
        // This must focus the filter field, not the predecessor text.
        me.input = me.filterInput;
        super.onPickerShow();
        me.input = ourInput;
    }

    listItemTpl(task) {
        return `<div class="b-predecessor-item-text">${task.name}</div>
            <div class="b-sch-box b-from" data-side="from"></div>
            <div class="b-sch-box b-to" data-side="to"></div>`;
    }

    get isValid() {
        return Boolean(!this.owner || this.parseDependencies(this.input.value));
    }

    set value(dependencies) {
        const
            me                     = this,
            predecessorsCollection = me.dependencies,
            startCollection        = me.startCollection;

        // Convert strings, eg: '1fs-2h;2ss+1d' to Dependency records
        if (typeof dependencies === 'string') {
            me.input.value = dependencies;
            dependencies = me.parseDependencies(dependencies);
            if (!dependencies) {
                me.updateInvalid();
                return;
            }
            for (let i = 0; i < dependencies.length; i++) {
                // Create a new one.
                // See if we always had a dependency pointing to the "other" task.
                const
                    newPredecessor = new me.dependencyStore.modelClass(dependencies[i]);
                let existingPredecessor = startCollection.getBy(me.otherSide, newPredecessor.fromEvent);

                if (existingPredecessor) {
                    // We must create a clone because the record is "live".
                    // Updates to it go back to the UI.
                    existingPredecessor = existingPredecessor.copy(existingPredecessor.id);
                    existingPredecessor.type = newPredecessor.type;
                    existingPredecessor.fullLag = newPredecessor.fullLag;
                }

                // Use the existing one if there is an exact match
                dependencies[i] = existingPredecessor || newPredecessor;
            }
        }
        else {
            me.startCollection.clear();
            me.startCollection.values = dependencies;
        }

        // Clear and then set the collection value to impose order.
        predecessorsCollection.clear();
        predecessorsCollection.values = dependencies;

        // If there has been a change, update the textual value.
        if (!me.inputting) {
            me.syncInputFieldValue();
        }
    }

    get value() {
        return this.dependencies.values;
    }

    onPredecesssorClick({ source : list, item, record : task, index, event }) {
        const
            me           = this.owner,
            dependencies = me.dependencies,
            box          = event.target.closest('.b-sch-box'),
            side         = box && box.dataset.side;

        let predecessor = dependencies.getBy(me.otherSide + 'Event', task);

        // Prevent regular selection continuing after this click handler.
        item.dataset.noselect = true;

        // Click text to remove predecessor completely
        if (predecessor && !box) {
            dependencies.remove(predecessor);
        }
        else {
            // Clicking a connect side box toggles that
            if (predecessor) {
                // We must create a clone because the record is "live".
                // Updates to it go back to the UI.
                predecessor = predecessor.copy(predecessor.id);
                predecessor.type = toggleTypes[side][predecessor.type];

                // Replace the old predecessor link with the new, modified one.
                // Collection will *replace* in-place due to ID matching.
                dependencies.add(predecessor);
            }
            // Create a new dependency to/from the clicked task
            else {
                dependencies.add(me.dependencyStore.createRecord({
                    [`${me.otherSide}Event`] : task,
                    [`${me.ourSide}Event`]   : me.owner.record
                }, true));
            }
        }
        me.syncInputFieldValue();
        list.refresh();
    }

    syncInputFieldValue() {
        this.input.value = this.constructor.predecessorsToString(this.dependencies.values, this.otherSide, this.delimiter);
    }

    static predecessorsToString(dependencies, otherSide, delimiter = ';') {
        const
            result = [];

        if (dependencies && dependencies.length) {
            for (const dependency of dependencies) {
                const
                    otherSideEvent   = dependency[otherSide + 'Event'],
                    otherSideEventId = otherSideEvent ? otherSideEvent.id : (otherSideEvent || '');

                result.push(`${otherSideEventId}${dependency.getConnectorString()}${dependency.getLag()}`);
            }
        }

        return result.join(delimiter);
    }

    parseDependencies(value) {
        const
            me              = this,
            grid            = me.grid,
            task            = me.owner.record,
            taskStore       = me.store,
            dependencyStore = me.dependencyStore,
            dependencies    = value.split(me.delimiterRegEx),
            DependencyModel = dependencyStore.modelClass,
            result          = [];

        for (let i = 0; i < dependencies.length; i++) {
            const
                predecessorText = dependencies[i];

            if (predecessorText) {
                let idLen = predecessorText.length + 1,
                    predecessorId,
                    predecessor = null;

                for (; idLen && !predecessor; idLen--) {
                    predecessorId = predecessorText.substr(0, idLen);
                    predecessor = taskStore.getById(predecessorId);
                }
                if (!predecessor) {
                    return null;
                }

                // Chop off connector and lag specification, ie the "SS-1h" part
                const
                    remainder = predecessorText.substr(idLen + 1),
                    // Start the structure of the dependency we are describing
                    dependency = {
                    // This will be "from" if we're editing predecessors
                    // and "to" if we're editing successors
                        [`${me.otherSide}Event`] : predecessor,

                        // This will be "to" if we're editing predecessors
                        // and "from" if we're editing successors
                        [`${me.ourSide}Event`] : task,

                        type : DependencyModel.Type.EndToStart
                    };

                // There's a trailing edge/lag spec
                if (remainder.length) {
                    const
                        edgeAndLag = dependencySuffixRe.exec(remainder);

                    if (edgeAndLag && (edgeAndLag[1] || edgeAndLag[2])) {
                        // The SS/FF bit
                        if (edgeAndLag[1]) {
                            dependency.type = dependencyTypes.indexOf(edgeAndLag[1].toUpperCase());
                        }
                        // The -1h bit
                        if (edgeAndLag[2]) {
                            const
                                parsedLag = DateHelper.parseDuration(edgeAndLag[2], true, grid.timeAxis.unit);
                            dependency.lag = parsedLag.magnitude;
                            dependency.lagUnit = parsedLag.unit;
                        }
                    }
                    else {
                        return null;
                    }
                }

                result.push(dependency);
            }
        }

        return result;
    }
};

BryntumWidgetAdapterRegister.register('dependencyfield', DependencyField);
