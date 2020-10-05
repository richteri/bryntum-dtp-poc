Class('BryntumSchedulerProTest', {
    // eslint-disable-next-line no-undef
    isa : BryntumSchedulerTest, // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)

    methods : {
        waitForPropagate : async function(partOfProject, next) {
            const async = this.beginAsync();

            partOfProject = partOfProject.project || partOfProject;

            await partOfProject.waitForPropagateCompleted();

            this.endAsync(async);

            next();
        }
    }
});
