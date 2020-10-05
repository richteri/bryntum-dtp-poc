/**
 * @module Scheduler/crud/mixin/CrudManagerView
 */

/**
 * This mixin class adds Crud Manager functionality to a {@link Grid.view.GridBase} instance.
 *
 * It adds {@link #config-crudManager} config allowing to provide a Crud Manager either as a class instance or as a configuration object
 * (for later the mixin provides {@link #config-crudManagerClass} config defining which class should be instantiated).
 *
 * The mixin also tracks Crud Manager requests to the server and masks the view during them. For masking it
 * uses the grid {@link Grid.view.GridBase#config-loadMask} and {@link Grid.view.GridBase#config-syncMask} properties.
 *
 * @mixin
 */
export default Target => class CrudManagerView extends (Target) {

    //region Config

    static get $name() {
        return 'CrudManagerView';
    }

    static get defaultConfig() {
        return {
            /**
             * Class that should be used to instantiate a CrudManager in case it's provided as a simple object to {@link #config-crudManager} config
             * @config {Scheduler.crud.AbstractCrudManagerMixin}
             * @category Data
             */
            crudManagerClass : null,

            /**
             * Supply a CrudManager instance or a config object if you want to use CrudManager for handling data
             * @config {Object|Scheduler.crud.AbstractCrudManagerMixin}
             * @category Data
             */
            crudManager : null
        };
    }

    //endregion

    //region Init

    afterConstruct() {
        const me = this;

        if (me.crudManager && me.loadMask && me.crudManager.isCrudManagerLoading) {
            // Show loadMask if crud manager is already loading
            me.maskBody(me.loadMask);
        }
    }

    //endregion

    /**
     * Hooks up crud manager listeners
     * @private
     * @category Store
     */
    bindCrudManager(crudManager) {
        this.detachListeners('crudManager');

        crudManager && crudManager.on({
            name         : 'crudManager',
            loadStart    : 'onCrudManagerLoadStart',
            load         : 'onCrudManagerLoad',
            loadCanceled : 'onCrudManagerLoadCanceled',
            syncStart    : 'onCrudManagerSyncStart',
            sync         : 'onCrudManagerSync',
            syncCanceled : 'onCrudManagerSyncCanceled',
            requestFail  : 'onCrudManagerRequestFail',
            thisObj      : this
        });
    }

    onCrudManagerLoadStart() {
        // Show loadMask before crud manager starts loading
        if (this.loadMask) {
            this.maskBody(this.loadMask);
        }
        this.toggleEmptyText();
    }

    onCrudManagerSyncStart() {
        if (this.syncMask) {
            this.maskBody(this.syncMask);
        }
    }

    onCrudManagerRequestFinalize(successful = true, requestType, response) {
        var me = this;

        if (!me.activeMask) return;

        if (successful) {
            me.unmaskBody();
            me.toggleEmptyText();
        }
        else {
            // Do not remove. Assertion strings for Localization sanity check.
            // 'L{GridBase.loadFailedMessage}'
            // 'L{GridBase.syncFailedMessage}'

            me.activeMask.icon = me.loadMaskErrorIcon;
            me.activeMask.text = `<div class="b-grid-load-failure">
                <div class="b-grid-load-fail">${me.L(`L{GridBase.${requestType}FailedMessage}`)}</div>
                ${response && response.message ? `<div class="b-grid-load-fail">${me.L('L{serverResponseLabel}')} ${response.message}</div>` : ''}
            </div>`;

            me.loadmaskHideTimer = me.setTimeout(() => {
                me.onCrudManagerRequestFinalize();
            }, me.loadMaskHideTimeout);
        }
    }

    onCrudManagerLoadCanceled() {
        this.onCrudManagerRequestFinalize();
    }

    onCrudManagerSyncCanceled() {
        this.onCrudManagerRequestFinalize();
    }

    onCrudManagerLoad() {
        this.onCrudManagerRequestFinalize();
    }

    onCrudManagerSync() {
        this.onCrudManagerRequestFinalize();
    }

    onCrudManagerRequestFail({ requestType, response }) {
        this.onCrudManagerRequestFinalize(false, requestType, response);
    }

    /**
     * Get/set the CrudManager instance
     * @property {Scheduler.data.CrudManager}
     * @category Data
     */
    get crudManager() {
        return this._crudManager;
    }

    set crudManager(crudManager) {
        const me = this;

        if (crudManager && crudManager.isCrudManager) {
            me._crudManager = crudManager;
        }
        else if (crudManager && me.crudManagerClass) {
            // TODO: get rid of this ugliness - crud manager cannot accept "scheduler" config
            // since it's meant to be a pure data class

            // CrudManager injects itself into is Scheduler's _crudManager property
            // because code it triggers needs to access it through its getter.
            crudManager = new me.crudManagerClass(Object.assign({
                scheduler : me
            }, crudManager));
        }
        else {
            me._crudManager = null;
        }

        me.bindCrudManager(me._crudManager);
    }
};
