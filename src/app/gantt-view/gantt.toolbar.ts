/**
 * Toolbar instance export
 */

// UMD bundle is used to support Edge browser. If you don't need it just use import {...} from 'bryntum-gantt' instead
import { Toolbar, Toast, DateHelper, Menu, Popup } from 'bryntum-gantt';

export default (gantt) => {
  const stm = gantt.project.stm;
  const toolbar = new Toolbar(getDefaultConfig(gantt));
  const updateUndoRedoButtons = () => {
    const redoCount = stm.length - stm.position;
    const { undoBtn, redoBtn } = toolbar.widgetMap;

    undoBtn.badge = stm.position || '';
    redoBtn.badge = redoCount || '';

    undoBtn.disabled = !stm.canUndo;
    redoBtn.disabled = !stm.canRedo;
  };

  stm.on({
    recordingstop : updateUndoRedoButtons,
    restoringstop : updateUndoRedoButtons,
    stmDisabled   : updateUndoRedoButtons,
    queueReset    : updateUndoRedoButtons,
  });

  return toolbar;
};

const getDefaultConfig = gantt => {
  return {
    owner: gantt,
    gantt,
    items: [
      {
        type: 'buttonGroup',
        items: [
          {
            type: 'button',
            color: 'b-green',
            ref: 'addTaskButton',
            icon: 'b-fa b-fa-plus',
            text: 'Create',
            tooltip: 'Create new task',
            onAction: 'up.onAddTaskClick'
          }
        ]
      },
      {
        type: 'buttonGroup',
        items: [
          {
            type: 'button',
            color: 'b-blue',
            ref: 'editTaskButton',
            icon: 'b-fa b-fa-pen',
            text: 'Edit',
            tooltip: 'Edit selected task',
            onAction: 'up.onEditTaskClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'undoBtn',
            icon: 'b-icon b-fa b-fa-undo',
            tooltip: 'Undo',
            disabled: true,
            width: '2em',
            onAction: 'up.onUndoClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'redoBtn',
            icon: 'b-icon b-fa b-fa-redo',
            tooltip: 'Redo',
            disabled: true,
            width: '2em',
            onAction: 'up.onRedoClick'
          }
        ]
      },
      {
        type: 'buttonGroup',
        items: [
          {
            type: 'button',
            color: 'b-blue',
            ref: 'expandAllButton',
            icon: 'b-fa b-fa-angle-double-down',
            tooltip: 'Expand all',
            onAction: 'up.onExpandAllClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'collapseAllButton',
            icon: 'b-fa b-fa-angle-double-up',
            tooltip: 'Collapse all',
            onAction: 'up.onCollapseAllClick'
          }
        ]
      },
      {
        type: 'buttonGroup',
        items: [
          {
            type: 'button',
            color: 'b-blue',
            ref: 'zoomInButton',
            icon: 'b-fa b-fa-search-plus',
            tooltip: 'Zoom in',
            onAction: 'up.onZoomInClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'zoomOutButton',
            icon: 'b-fa b-fa-search-minus',
            tooltip: 'Zoom out',
            onAction: 'up.onZoomOutClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'zoomToFitButton',
            icon: 'b-fa b-fa-compress-arrows-alt',
            tooltip: 'Zoom to fit',
            onAction: 'up.onZoomToFitClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'previousButton',
            icon: 'b-fa b-fa-angle-left',
            tooltip: 'Previous time span',
            onAction: 'up.onShiftPreviousClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'nextButton',
            icon: 'b-fa b-fa-angle-right',
            tooltip: 'Next time span',
            onAction: 'up.onShiftNextClick'
          }
        ]
      },
      {
        type: 'buttonGroup',
        items: [
          {
            type: 'button',
            color: 'b-blue',
            ref: 'featuresButton',
            icon: 'b-fa b-fa-tasks',
            text: 'Features',
            tooltip: 'Toggle features',
            toggleable: true,
            onAction: 'up.onFeaturesClick'
          },
          {
            type: 'button',
            color: 'b-blue',
            ref: 'settingsButton',
            icon: 'b-fa b-fa-cogs',
            text: 'Settings',
            tooltip: 'Adjust settings',
            toggleable: true,
            onAction: 'up.onSettingsClick'
          }
        ]
      },
      {
        type: 'textfield',
        ref: 'filterByName',
        width: '13em',
        placeholder: 'Find tasks by name',
        clearable: true,
        keyStrokeChangeDelay: 100,
        triggers: {
          filter: {
            align: 'start',
            cls: 'b-fa b-fa-filter'
          }
        },
        onChange: 'up.onFilterChange'
      }
    ],

    // region controller methods
    async onAddTaskClick(): Promise<any> {
      const added = gantt.taskStore.rootNode.appendChild({
        name: 'New task',
        duration: 1
      });
      // run propagation to calculate new task fields
      await gantt.project.propagate();

      // scroll to the added task
      await gantt.scrollRowIntoView(added);

      gantt.features.cellEdit.startEditing({
        record: added,
        field: 'name'
      });

    },

    onEditTaskClick(): void {
      if (gantt.selectedRecord) {
        gantt.editTask(gantt.selectedRecord);
      } else {
        Toast.show('First select the task you want to edit');
      }
    },

    onExpandAllClick(): void {
      gantt.expandAll();
    },

    onCollapseAllClick(): void {
      gantt.collapseAll();
    },

    onZoomInClick(): void {
      gantt.zoomIn();
    },

    onZoomOutClick(): void {
      gantt.zoomOut();
    },

    onZoomToFitClick(): void {
      gantt.zoomToFit({
        leftMargin: 50,
        rightMargin: 50
      });
    },

    onShiftPreviousClick(): void {
      gantt.shiftPrevious();
    },

    onShiftNextClick(): void {
      gantt.shiftNext();
    },

    onFilterChange({ value }): void {
      if (value === '') {
        gantt.taskStore.clearFilters();
      } else {
        value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        gantt.taskStore.filter(task => task.name && task.name.match(new RegExp(value, 'i')));
      }
    },

    onFeaturesClick({ source }): void {
      const features = gantt.features;
      const menu = new Menu({
        forElement: source.element,
        closeAction: 'destroy',
        items: [
          {
            text: 'Draw dependencies',
            checked: !features.dependencies.disabled,
            onToggle: () => features.dependencies.disabled = !features.dependencies.disabled
          },
          {
            text: 'Task labels',
            checked: !features.labels?.disabled,
            onToggle: () => features.labels.disabled = !features.labels.disabled
          },
          {
            text: 'Project lines',
            checked: !features.projectLines.disabled,
            onToggle: () => features.projectLines.disabled = !features.projectLines.disabled
          },
          {
            text: 'Highlight non-working time',
            checked: !features.nonWorkingTime.disabled,
            onToggle: () => features.nonWorkingTime.disabled = !features.nonWorkingTime.disabled
          },
          {
            text: 'Enable cell editing',
            checked: !features.cellEdit.disabled,
            onToggle: () => features.cellEdit.disabled = !features.cellEdit.disabled
          },
          {
            text: 'Hide schedule',
            cls: 'b-separator',
            checked: gantt.subGrids.normal.collapsed,
            onToggle: () => gantt.subGrids.normal.collapsed = !gantt.subGrids.normal.collapsed
          }
        ],
        listeners: {
          destroy(): void {
            source.pressed = false;
          }
        }
      });
    },

    onSettingsClick({ source }): void {
      const popup = new Popup({
        forElement: source.element,
        closeAction: 'destroy',
        anchor: true,
        layoutStyle: {
          flexDirection: 'column'
        },
        items: [
          {
            type: 'slider',
            ref: 'rowHeight',
            text: 'Row height',
            width: '10em',
            showValue: true,
            value: gantt.rowHeight,
            min: 30,
            max: 70,
            style: 'margin-bottom: .5em',
            onInput({ value }): void {
              gantt.rowHeight = value;
              popup.widgetMap.barMargin.max = (value / 2) - 5;
            }
          },
          {
            type: 'slider',
            ref: 'barMargin',
            text: 'Bar margin',
            width: '10em',
            showValue: true,
            value: gantt.barMargin,
            min: 0,
            max: (gantt.rowHeight / 2) - 5,
            onInput: ({ value }) => gantt.barMargin = value
          }
        ],
        listeners: {
          destroy(): void {
            source.pressed = false;
          }
        }
      });
    },

    onUndoClick(): void {
      if (gantt.project.stm.canUndo) {
        gantt.project.stm.undo();
      }
    },

    onRedoClick(): void {
      if (gantt.project.stm.canRedo) {
        gantt.project.stm.redo();
      }
    }

  };

};
