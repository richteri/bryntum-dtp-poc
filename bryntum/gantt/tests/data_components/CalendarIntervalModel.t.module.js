import { CalendarIntervalModel, CalendarModel, ProjectModel } from '../../build/gantt.module.js';

StartTest(t => {
    let project;
    
    t.beforeEach(() => {
        project && project.destroy();
    });
    
    t.it('Should configure calendar interval model', async t => {
        class MyCalendarIntervalModel extends CalendarIntervalModel {}
        
        class MyCalendarModel extends CalendarModel {
            static get defaultConfig() {
                return {
                    calendarIntervalModelClass : MyCalendarIntervalModel
                };
            }
        }
        
        project = new ProjectModel({
            calendarModelClass : MyCalendarModel,
            
            calendarsData : [{
                id        : 1,
                intervals : [
                    { startDate : '2020-03-20', endDate : '2020-03-22', isWorking : false }
                ]
            }]
        });
        
        await project.propagate();
        
        const calendar = project.getCalendarById(1);
        
        const [interval] = calendar.intervalStore.getRange();
        
        t.ok(interval instanceof MyCalendarIntervalModel, 'Calendar interval class is ok');
    });
});
