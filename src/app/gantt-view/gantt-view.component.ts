import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BryntumWidgetAdapterRegister, Combo, DateField, DateHelper, Gantt, Panel, ProjectModel, Store, TaskModel } from 'bryntum-gantt';

import ganttToolbar from './gantt.toolbar';

class MyTaskModel extends TaskModel {
  static get fields(): any[] {
    return [
      { name: 'partner', type: 'string' }
    ];
  }
}

class DateTimeField extends DateField {
  transformTimeValue(value): Date {
    const me = this as any;
    value = DateHelper.clone(value);

    const timeValue = DateHelper.parse(value, 'HH:mm');

    if (DateHelper.isValidDate(timeValue)) {
      DateHelper.copyTimeValues(value, timeValue);
    } // otherwise try to copy from the current value
    else if (DateHelper.isValidDate(me.value)) {
      DateHelper.copyTimeValues(value, me.value);
    } // else don't change time

    return value;
  }
}

// Register the custom widget to make it available
BryntumWidgetAdapterRegister.register('datetime', DateTimeField);

@Component({
  selector: 'app-gantt-view',
  templateUrl: './gantt-view.component.html',
  styleUrls: ['./gantt-view.component.css']
})
export class GanttViewComponent implements OnInit, OnDestroy {

  private elementRef: ElementRef;
  private timeRangeTimer: any;
  private panel: Panel;

  constructor(element: ElementRef) {
    this.elementRef = element;
  }

  ngOnDestroy(): void {
    clearInterval(this.timeRangeTimer);
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    const project = new ProjectModel({
      id: 'root-project',
      name: 'Root project',
      calendar: 'office-hours',
      startDate: new Date(),
      taskModelClass: MyTaskModel,
      eventsData: [
        {
          id: 1,
          name: 'Planning',
          duration: 2,
          durationUnit: 'day',
          calendar: 'office-hours',
          partner: '52475998-1469-47c8-b3cd-51e10e8d7882',
        },
        {
          id: 2,
          name: 'Implementation',
          duration: 4,
          durationUnit: 'day',
          calendar: 'office-hours',
          partner: '46661cbf-50a0-4b59-9859-13f6ed1d49e4',
        }
      ],
      dependenciesData: [
        {
          fromEvent: 1,
          toEvent: 2,
        }
      ],
      calendarsData: [
        {
          id: 'office-hours',
          name: 'Office Hours w. Lunch Break',
          unspecifiedTimeIsWorking: false,
          intervals: [
            {
              recurrentStartDate: 'every weekday at 6:00 am',
              recurrentEndDate: 'every weekday at 10:00 am',
              isWorking: true,
            },
            {
              recurrentStartDate: 'every weekday at 11:00 am',
              recurrentEndDate: 'every weekday at 3:00 pm',
              isWorking: true,
            },
          ],
        },
      ],
    });

    const [timeRangeNow] = project.timeRangeStore.add({
      id: 1,
      name: 'Important date',
      startDate: '2020-09-28',
      duration: 0,
      cls: 'b-fa b-fa-diamond'
    });

//    this.timeRangeTimer = setInterval(() => timeRangeNow.setStartDate(new Date()), 1000);

    const optionStore = new Store({
      data: [],
    });

    const gantt = new Gantt({
      project,
      width: '100%',
      height: '500px',
      columns: {
        data: [
          {
            field: 'partner',
            text: 'Partner',
            type: 'template',
            template: ({ record: { partner } }) => optionStore.getById(partner)?.name ?? '',
            editor: new Combo({
              store: optionStore,
              valueField: 'id',
              displayField: 'name',
            }),
          },
          { text: 'Start', field: 'startDate', type: 'date', format: 'YYYY-MM-DD HH:mm', editor: 'datetime' },
          { text: 'End', field: 'endDate', type: 'date', format: 'YYYY-MM-DD HH:mm', editor: 'datetime' },
        ],
      },
      features: {
        timeRanges: true,
        taskEdit: {
          editorConfig: {
            extraItems: {
              generaltab: [
                new Combo({
                  store: optionStore,
                  valueField: 'id',
                  displayField: 'name',
                  label: 'Partner',
                  name: 'partner',
                })
              ],
            }
          },
        }
      }
    });

    setTimeout(() => {
      optionStore.add([
        { id: '52475998-1469-47c8-b3cd-51e10e8d7882', name: 'Option 1' },
        { id: '46661cbf-50a0-4b59-9859-13f6ed1d49e4', name: 'Option 2' },
        { id: '64b913d9-77bf-4167-b2e0-17310e994e7c', name: 'Option 3' },
        { id: '77c61844-9420-4367-9446-38e7cb71ccfa', name: 'Option 4' },
        { id: '17d5a8f3-c84c-4c66-aa82-7340a34b3a21', name: 'Option 5' },
      ]);

      gantt.refreshColumn(gantt.columns.get('partner'));
    }, 2000);

    this.panel = new Panel({
      appendTo: this.elementRef.nativeElement,
      items: [gantt],
      tbar: ganttToolbar(gantt),
    });

    const stm = gantt.project.stm;
    stm.enable();
    stm.autoRecord = true;
  }

}
