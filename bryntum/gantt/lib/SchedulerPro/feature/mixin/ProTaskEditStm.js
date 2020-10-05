import Base from '../../../Core/Base.js';

/**
 * @module SchedulerPro/feature/mixin/ProTaskEditStm
 */

/**
 * Mixin adding STM transactable behavior to TaskEdit feature.
 *
 * @mixin
 */
export default Target => class TaskEditStm extends (Target || Base) {

    getProject() {
        let result;

        if (super.getProject) {
            result = super.getProject();
        }
        else {
            throw new Error('Abstract method call!');
        }

        return result;
    }

    captureStm() {
        const
            me      = this,
            project = me.getProject(),
            stm     = project.getStm();

        me.stmInitiallyDisabled = stm.disabled;
        me.stmInitiallyAutoRecord = stm.autoRecord;

        if (me.stmInitiallyDisabled) {
            stm.enable();
            // it seems this branch has never been exersized by tests
            // but the intention is to stop the auto-recording while
            // task editor is active (all editing is one manual transaction)
            stm.autoRecord = false;
        }
        else {
            if (me.stmInitiallyAutoRecord) {
                stm.autoRecord = false;
            }
            if (stm.isRecording) {
                stm.stopTransaction();
            }
        }
    }

    startStmTransaction() {
        // TODO: Create title: "Editing event/task 'name'"
        this.getProject().getStm().startTransaction();
    }

    commitStmTransaction() {
        const
            me  = this,
            stm = me.getProject().getStm();

        stm.stopTransaction();

        if (me.stmInitiallyDisabled) {
            stm.resetQueue();
        }
    }

    rejectStmTransaction() {
        const
            stm        = this.getProject().getStm(),
            { client } = this;

        if (stm.transaction.length) {

            client.suspendRefresh();

            stm.forEachStore(s => s.beginBatch());

            stm.rejectTransaction();

            stm.forEachStore(s => s.endBatch());

            client.resumeRefresh(true);
        }
        else {
            stm.stopTransaction();
        }
    }

    enableStm() {
        this.getProject().getStm().enable();
    }

    disableStm() {
        this.getProject().getStm().disable();
    }

    freeStm() {
        const
            me  = this,
            stm = me.getProject().getStm();

        stm.disabled = me.stmInitiallyDisabled;
        stm.autoRecord = me.stmInitiallyAutoRecord;
    };
};
