import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import DependencyField from '../widget/DependencyField.js';
import Delayable from '../../Core/mixin/Delayable.js';
import WidgetHelper from '../../Core/helper/WidgetHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';

/**
 * @module Gantt/column/DependencyColumn
 */
const
    hasNoProject = v => !v.project,
    depIsValid   = v => v,
    // Only allowed to check one dependency at the time, since validation triggers a propagate.
    // Need to wait for one to finish before starting the next.
    checkNext = async(toValidate, dependencyStore, results) => {
        const dependency = toValidate.shift();

        if (dependency) {
            // TODO: Could bail out on first fail, but probably a more detailed error msg should be shown
            //   instead with info on which deps where invalid
            results.push(
                await dependencyStore.isValidDependency({
                    fromEvent : dependency.fromEvent,
                    toEvent   : dependency.toEvent,
                    lag       : dependency.lag,
                    lagUnit   : dependency.lagUnit,
                    type      : dependency.type
                })
            );

            await checkNext(toValidate, dependencyStore, results);
        }
    };

/**
 * A column which displays, in textual form, the dependencies which either link to the
 * contextual task from other, preceding tasks, or dependencies which link the
 * contextual task to successor tasks.
 *
 * Default editor is a {@link Gantt.widget.DependencyField DependencyField}.
 *
 * The {@link Grid/column/Column#config-field} MUST be either `predecessors` or `successors` in order
 * for this column to know what kind of dependency it is showing.
 *
 * @classType dependency
 * @extends Grid/column/Column
 * @typings Scheduler/column/DependencyColumn -> Scheduler/column/SchedulerDependencyColumn
 */
export default class DependencyColumn extends Delayable(Column) {
    static get type() {
        return 'dependency';
    }

    static get fields() {
        return [
            /**
             * Delimiter used for displayed value and editor
             * @config {String} delimiter
             */
            { name : 'delimiter', defaultValue : ';' }
        ];
    }

    static get defaults() {
        return {
            htmlEncode : false,
            width      : 120,
            renderer({ record }) {
                return DependencyField.predecessorsToString(record[this.field], this.field === 'predecessors' ? 'from' : 'to', this.delimiter);
            }
        };
    }

    afterConstruct() {
        //<debug>
        if (this.field !== 'predecessors' && this.field !== 'successors') {
            throw new Error('Dependency column field must be either \'predecessors\' or \'successors\'');
        }
        //</debug>

        super.afterConstruct();
    }

    async finalizeCellEdit({ grid, record, inputField, value, oldValue, editorContext }) {
        if (record && value) {
            value = value.slice();

            const
                { dataField }       = editorContext.editor,
                toValidate          = value.filter(hasNoProject),
                results             = [];

            // Will wait for all to finish, since it is recursive
            await checkNext(toValidate, grid.dependencyStore, results);

            const valid = results.every(depIsValid);

            // Validation passed, update the context record
            if (valid) {
                const setterName = `set${StringHelper.capitalizeFirstLetter(dataField)}`;
                if (record[setterName]) {
                    record[setterName](value);
                }
                else {
                    record[dataField] = value;
                }
            }
            // Validation failed; revert the field's value
            else {
                inputField.value = oldValue;
                WidgetHelper.toast(editorContext.column.L('L{Invalid dependency found, change is reverted}'));
            }
            return valid;
        }
    }

    get defaultEditor() {
        const me = this,
            isPredecessor = me.field === 'predecessors';

        return {
            type            : 'dependencyfield',
            grid            : me.grid,
            name            : me.field,
            delimiter       : me.delimiter,
            ourSide         : isPredecessor ? 'to' : 'from',
            otherSide       : isPredecessor ? 'from' : 'to',
            store           : me.grid.eventStore || me.grid.taskStore,
            dependencyStore : me.grid.features.dependencies.store
        };
    }
}

ColumnStore.registerColumnType(DependencyColumn);
