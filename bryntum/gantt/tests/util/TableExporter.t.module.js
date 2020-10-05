import { TableExporter, DateHelper } from '../../build/gantt.module.js';

StartTest(t => {
    let gantt, exporter;
    
    t.beforeEach(() => {
        gantt && gantt.destroy();
        exporter && exporter.destroy();
    });
    
    t.it('Exported columns should be properly converted to strings', async t => {
        gantt = t.getGantt({
            tasks : [
                {
                    id        : 1,
                    name      : 'Task 1',
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 2,
                    name      : 'Task 2',
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id             : 3,
                    name           : 'Task 3',
                    startDate      : '2017-01-16',
                    duration       : 1,
                    calendar       : 'general',
                    constraintDate : '2017-01-18',
                    constraintType : 'startnolaterthan',
                    effort         : 1,
                    percentDone    : 34,
                    showInTimeline : true
                },
                {
                    id        : 4,
                    name      : 'Task 4',
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id        : 5,
                    name      : 'Task 5',
                    startDate : '2017-01-16',
                    duration  : 1
                },
                {
                    id   : 6,
                    name : 'empty'
                }
            ],
            
            dependencies : [
                { fromTask : 1, toTask : 3 },
                { fromTask : 2, toTask : 3 },
                { fromTask : 3, toTask : 4 },
                { fromTask : 3, toTask : 5 }
            ],
            
            assignments : [
                { event : 3, resource : 1 },
                { event : 3, resource : 2, units : 50 },
                { event : 3, resource : 3, units : 10 }
            ],
            
            resources : [
                { id : 1, name : 'Andy' },
                { id : 2, name : 'Dwight' },
                { id : 3, name : 'Jim' }
            ],
            
            columns : [
                { type : 'calendar' },
                { type : 'constraintdate' },
                { type : 'constrainttype' },
                { type : 'duration' },
                { type : 'earlyenddate' },
                { type : 'earlystartdate' },
                { type : 'effort' },
                { type : 'enddate' },
                { type : 'eventmode' },
                { type : 'lateenddate' },
                { type : 'latestartdate' },
                { type : 'manuallyscheduled' },
                { type : 'milestone' },
                { type : 'name' },
                { type : 'note' },
                { type : 'percentdone' },
                { type : 'predecessor' },
                { type : 'resourceassignment' },
                { type : 'schedulingmodecolumn' },
                { type : 'sequence' },
                { type : 'showintimeline' },
                { type : 'startdate' },
                { type : 'successor' },
                { type : 'totalslack' },
                { type : 'wbs' }
            ],
            
            subGridConfigs : {
                normal : {
                    width : 100
                }
            }
        });
        
        await gantt.project.waitForPropagateCompleted();
        
        const exporter = new TableExporter({ target : gantt });
        
        const { rows } = exporter.export();
        
        // rows would have class instances as values, need to stringify them all
        let row = rows[2].map(cell => cell instanceof Date ? DateHelper.format(cell, 'YYYY-MM-DD') : cell.toString());
        
        t.isDeeply(row, [
            'General',
            '2017-01-18',
            'Start no later than',
            '1 day',
            '2017-01-18',
            '2017-01-17',
            '1 hour',
            '2017-01-18',
            'Auto',
            '2017-01-18',
            '2017-01-17',
            'false',
            'false',
            'Task 3',
            '',
            '34%',
            '1;2',
            'Andy 100%,Dwight 50%,Jim 10%',
            'Normal',
            '3',
            'true',
            '2017-01-17',
            '4;5',
            '0 days',
            '3'
        ], 'Task 3 exported fine');
        
        row = rows[5].map(cell => cell instanceof Date ? DateHelper.format(cell, 'YYYY-MM-DD') : cell.toString());
        
        t.isDeeply(row, [
            '',             // calendar
            '',             // constraintdate
            '',             // constrainttype
            '',             // duration
            '',             // earlyenddate
            '2017-01-16',   // earlystartdate
            '',             // effort
            '',             // enddate
            'Auto',         // eventmode
            '2017-01-19',   // lateenddate
            '',             // latestartdate
            'false',        // manuallyscheduled
            'false',        // milestone
            'empty',        // name
            '',             // note
            '0%',           // percentdone
            '',             // predecessor
            '',             // resourceassignment
            'Normal',       // schedulingmodecolumn
            '6',            // sequence
            '',             // showintimeline
            '2017-01-16',   // startdate
            '',             // successor
            '',             // totalslack
            '6'             // wbs
        ], 'Empty task 6 is exported fine');
    });
});
