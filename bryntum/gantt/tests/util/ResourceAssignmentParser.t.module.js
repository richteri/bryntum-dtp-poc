import { ResourceAssignmentParser } from '../../build/gantt.module.js';

StartTest((t) => {
    const { parse, compose } = ResourceAssignmentParser;

    t.it('Should parse resource assignment strings into structured result', (t) => {
        const str = 'Maxim Bazhenov [ 9 0, 5 %], Mats Bryntse';

        t.isDeeply(
            parse(str),
            {
                rest        : '',
                assignments : [{
                    name     : 'Maxim Bazhenov',
                    units    : 90.5,
                    position : 0,
                    match    : 'Maxim Bazhenov [ 9 0, 5 %], '
                }, {
                    name     : 'Mats Bryntse',
                    units    : 100,
                    position : 28,
                    match    : 'Mats Bryntse'
                }]
            },
            'Resource assignment string is parsed correctly'
        );
    });

    t.it('Should at least partially parse invalid resource assignment strings into structured result', (t) => {
        const str = 'Maxim Bazhenov [ 9 0, 5 %], [nn]';

        t.isDeeply(
            parse(str),
            {
                rest        : ', [nn]',
                assignments : [{
                    name     : 'Maxim Bazhenov',
                    units    : 90.5,
                    position : 0,
                    match    : 'Maxim Bazhenov [ 9 0, 5 %]'
                }]
            },
            'Resource assignment string is parsed correctly'
        );
    });

    t.it('Should compose parsing results back to string', (t) => {
        const strF = 'Maxim Bazhenov [ 9 0, 5 %], Mats Bryntse';

        const resultF = parse(strF);

        t.is(compose(resultF), 'Maxim Bazhenov [90.5%], Mats Bryntse [100%]', 'Fully parsed result composed ok');

        const strP = 'Maxim Bazhenov [ 9 0, 5 %], [nn]';

        const resultP = parse(strP);

        t.is(compose(resultP), 'Maxim Bazhenov [90.5%], [nn]', 'Partially parsed result composed ok');
    });

    t.it('Should compose exactly if requested so and is possible', (t) => {
        const str = 'Maxim Bazhenov [ 9 0, 5 %], Mats Bryntse';

        t.is(compose(parse(str), true), str, 'Exact composition is correct');
    });
});
