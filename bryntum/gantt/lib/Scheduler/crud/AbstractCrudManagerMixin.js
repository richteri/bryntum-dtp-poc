import Store from '../../Core/data/Store.js';
import Delayable from '../../Core/mixin/Delayable.js';
import ObjectHelper from '../../Core/helper/ObjectHelper.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import ArrayHelper from '../../Core/helper/ArrayHelper.js';

/**
 * @module Scheduler/crud/AbstractCrudManagerMixin
 */

const
    storeSortFn     = function(lhs, rhs, sortProperty) {
        // TODO: get rid of these StoreDescriptors. Just use Stores.
        if (lhs.store) {
            lhs = lhs.store;
        }
        if (rhs.store) {
            rhs = rhs.store;
        }

        lhs = lhs[sortProperty] || 0;
        rhs = rhs[sortProperty] || 0;
        return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
    },

    // Sorter function to keep stores in loadPriority order
    storeLoadSortFn = function(lhs, rhs) {
        return storeSortFn(lhs, rhs, 'loadPriority');
    },

    // Sorter function to keep stores in syncPriority order
    storeSyncSortFn = function(lhs, rhs) {
        return storeSortFn(lhs, rhs, 'syncPriority');
    },
    nullFn          = () => {};

/**
 * An abstract mixin that supplies most of the CrudManager functionality.
 * It implements basic mechanisms of collecting stores to organize batch communication with a server.
 * Yet it does not contain methods related to _data transfer_ nor _encoding_.
 * These methods are to be provided in sub-classes.
 * Out of the box there are mixins implementing {@link Scheduler.crud.transport.AjaxTransport support of AJAX for data transferring}
 * and {@link Scheduler.crud.encoder.JsonEncoder JSON for data encoding system}.
 * For example this is how we make a model that will implement CrudManager protocol and use AJAX/JSON to pass the dada to the server:
 *
 * ```javascript
 * class SystemSettings extends JsonEncode(AjaxTransport(AbstractCrudManagerMixin(Model))) {
 *     ...
 * }
 * ```
 *
 * ## Data transfer and encoding methods
 *
 * These are methods that must be provided by subclasses of this class:
 *
 * - {@link #function-sendRequest sendRequest}
 * - {@link #function-cancelRequest cancelRequest}
 * - {@link #function-encode encode}
 * - {@link #function-decode decode}
 *
 * @mixin
 * @abstract
 */
export default Target => class AbstractCrudManagerMixin extends Delayable(Target) {

    //region Default config

    static get defaultConfig() {
        return {
            // overrideCrudStoreLoad : false,

            /**
             * The server revision stamp.
             * The _revision stamp_ is a number which should be incremented after each server-side change.
             * This property reflects the current version of the data retrieved from the server and gets updated after each {@link #function-load} and {@link #function-sync} call.
             * @property {Number}
             * @readonly
             */
            crudRevision : null,

            /**
             * A list of registered stores whose server communication will be collected into a single batch.
             * Each store is represented by a _store descriptor_, an object having following structure:
             * @member {Object[]} crudStores
             * @property {String} stores.storeId Unique store identifier.
             * @property {Core.data.Store} stores.store Store itself.
             * @property {String} [stores.phantomIdField] Set this if store model has a predefined field to keep phantom record identifier.
             * @property {String} [stores.idField] id field name, if it's not specified then class will try to get it from a store model.
             */

            /**
             * Sets the list of stores controlled by the CRUD manager.
             * Store can be provided by itself, its storeId or an object having the following structure:
             * @property {String} stores.storeId Unique store identifier. Under this name the store related requests/responses will be sent.
             * @property {Core.data.Store} stores.store The store itself.
             * @property {String} [stores.phantomIdField] Set this if the store model has a predefined field to keep phantom record identifier.
             * @property {String} [stores.idField] id field name, if it's not specified then class will try to get it from a store model.
             * @config {Core.data.Store[]|String[]|Object[]}
             */
            crudStores : [],

            /**
             * Name of a store property to retrieve store identifiers from.
             * Store identifier is used as a container name holding corresponding store data while transferring them to/from the server.
             * By default `storeId` property is used. And in case a container identifier has to differ this config can be used:
             *
             * ```javascript
             * class CatStore extends Store {
             *     // storeId is "meow" but for sending/receiving store data
             *     // we want have "cats" container in JSON, so we create a new property "storeIdForCrud"
             *     storeId          : 'meow',
             *     storeIdForCrud   : 'cats'
             * });
             *
             * class MyCrudManager extends CrudManager {
             *     ...
             *     crudStores           : ['meow'],
             *     // crud manager will get store identifier from "storeIdForCrud" property
             *     storeIdProperty  : 'storeIdForCrud'
             * });
             * ```
             * The `storeIdProperty` property can also be specified directly on a store:
             *
             * ```javascript
             * class CatStore extends Store {
             *     // storeId is "meow" but for sending/receiving store data
             *     // we want have "cats" container in JSON
             *     storeId          : 'meow',
             *     // so we create a new property "storeIdForCrud"..
             *     storeIdForCrud  : 'cats',
             *     // and point CrudManager to use it as the store identifier source
             *     storeIdProperty  : 'storeIdForCrud'
             * });
             *
             * class DogStore extends Store {
             *     // storeId is "dogs" and it will be used as a container name for the store data
             *     storeId          : 'dogs'
             * });
             *
             * class MyCrudManager extends CrudManager {
             *     ...
             *     crudStores           : ['meow', 'dogs']
             * });
             * ```
             * @config {String}
             */
            storeIdProperty : 'storeId',

            // TODO: no support for remote filtering yet
            // /**
            //  * The name of the 'filter' parameter to send in a load request.
            //  * @config {String}
            //  * @default
            //  */
            crudFilterParam : 'filter',

            /**
             * Sends request to the server.
             * @function sendRequest
             * @param {Object} request The request to send. An object having following properties:
             * @param {String} request.data {@link #function-encode Encoded} request.
             * @param {String} request.type Request type, can be either `load` or `sync`
             * @param {Function} request.success Callback to be started on successful request transferring
             * @param {Function} request.failure Callback to be started on request transfer failure
             * @param {Object} request.thisObj `this` reference for the above `success` and `failure` callbacks
             * @return {Promise} The request promise.
             * @abstract
             */

            /**
             * Cancels request to the server.
             * @function cancelRequest
             * @param {Object} request The request to cancel (a value returned by corresponding {@link #function-sendRequest} call).
             * @abstract
             */

            /**
             * Encodes request to the server.
             * @function encode
             * @param {Object} request The request to encode.
             * @returns {String} The encoded request.
             * @abstract
             */

            /**
             * Decodes response from the server.
             * @function decode
             * @param {String} response The response to decode.
             * @returns {Object} The decoded response.
             * @abstract
             */

            transport : {},

            /**
             * When `true` forces the CRUD manager to process responses depending on their `type` attribute.
             * So `load` request may be responded with `sync` response for example.
             * Can be used for smart server logic allowing the server to decide when it's better to respond with a complete data set (`load` response)
             * or it's enough to return just a delta (`sync` response).
             * @config {Boolean}
             * @default
             */
            trackResponseType : false,

            /**
             * Field name to be used to transfer a phantom record identifier.
             * @config {String}
             * @default
             */
            phantomIdField : '$PhantomId',

            /**
             * Field name to be used to transfer a phantom parent record identifier.
             * @config {String}
             * @default
             */
            phantomParentIdField : '$PhantomParentId',

            /**
             * `true` to automatically call {@link #function-load} method after creation.
             * @config {Boolean}
             * @default
             */
            autoLoad : false,

            /**
             * The timeout in milliseconds to wait before persisting changes to the server.
             * Used when {@link #config-autoSync} is set to `true`.
             * @config {Number}
             * @default
             */
            autoSyncTimeout : 100,

            /**
             * `true` to automatically persist store changes after edits are made in any of the stores monitored.
             * Please note that sync request will not be invoked immediately but only after {@link #config-autoSyncTimeout} interval.
             * @config {Boolean}
             * @default
             */
            autoSync : false,

            /**
             * `True` to reset identifiers (defined by `idField` config) of phantom records before submitting them to the server.
             * @config {Boolean}
             * @default
             */
            resetIdsBeforeSync : true,

            /**
             * @member {Object[]} syncApplySequence
             * An array of stores presenting an alternative sync responses apply order.
             * Each store is represented by a _store descriptor_, an object having following structure:
             * @property {String} syncApplySequence.storeId Unique store identifier.
             * @property {Core.data.Store} syncApplySequence.store Store itself.
             * @property {String} [syncApplySequence.phantomIdField] Set this if store model has a predefined field to keep phantom record identifier.
             * @property {String} [syncApplySequence.idField] id field name, if it's not specified then class will try to get it from a store model.
             */

            /**
             * An array of store identifiers sets an alternative sync responses apply order.
             * By default the order in which sync responses are applied to the stores is the same as they registered in.
             * But in case of some tricky dependencies between stores this order can be changed:
             *
             *```javascript
             * class MyCrudManager extends CrudManager {
             *     // register stores (they will be loaded in the same order: 'store1' then 'store2' and finally 'store3')
             *     crudStores : ['store1', 'store2', 'store3'],
             *     // but we apply changes from server to them in an opposite order
             *     syncApplySequence : ['store3', 'store2', 'store1']
             * });
             *```
             * @config {String[]}
             */
            syncApplySequence : [],

            orderedCrudStores : [],

            /**
             * true to write all fields from the record to the server. If set to false it will only send the fields that
             * were modified. Note that any fields that have `persist` set to false will still be ignored while those
             * with `critical` set to true will be included.
             * @config {Boolean}
             * @default
             */
            writeAllFields : false,

            crudIgnoreUpdates : 0,

            // Flag that shows if crud manager performed successful load request
            crudLoaded : false,

            createMissingRecords : false,
            autoSyncTimerId      : null,

            applyingLoadResponse : false,
            applyingSyncResponse : false,

            callOnFunctions : true
        };
    }

    //endregion

    get isCrudManager() {
        return true;
    }

    //region Init

    construct(config = {}) {
        this._requestId = 0;
        this.activeRequests = {};
        this.crudStoresIndex = {};

        super.construct(config);
    }

    afterConstruct() {
        super.afterConstruct();

        if (this.autoLoad) {
            this.load().catch(error => {
                if (!this.isValidResponse(error.rawResponse, error.response)) {
                    throw error;
                }
            });
        }
    }

    //endregion

    //region Store descriptors & index

    /**
     * Returns a registered store descriptor.
     * @param {String|Core.data.Store} storeId The store identifier or registered store instance.
     * @returns {Object} The descriptor of the store.
     */
    getStoreDescriptor(storeId) {
        if (!storeId) return null;

        if (storeId instanceof Store) return this.crudStores.find(storeDesc => storeDesc.store === storeId);

        if (typeof storeId === 'object') return this.crudStoresIndex[storeId.storeId];

        return this.crudStoresIndex[storeId] || this.getStoreDescriptor(Store.getStore(storeId));
    }

    fillStoreDescriptor(descriptor) {
        const
            { store } = descriptor,
            {
                storeIdProperty = this.storeIdProperty,
                modelClass
            }         = store;

        if (!descriptor.storeId) {
            descriptor.storeId = store[storeIdProperty];
        }
        if (!descriptor.idField) {
            descriptor.idField = modelClass.idField;
        }
        if (!descriptor.phantomIdField) {
            descriptor.phantomIdField = modelClass.phantomIdField;
        }
        if (!descriptor.phantomParentIdField) {
            descriptor.phantomParentIdField = modelClass.phantomParentIdField;
        }
        if (!('writeAllFields' in descriptor)) {
            descriptor.writeAllFields = store.writeAllFields;
        }

        return descriptor;
    }

    updateCrudStoreIndex() {
        const
            crudStoresIndex = this.crudStoresIndex = {};

        this.crudStores.forEach(store => store.storeId && (crudStoresIndex[store.storeId] = store));
    }

    //endregion

    //region Store collection (add, remove, get & iterate)

    /**
     * Returns a registered store.
     * @param {String} storeId Store identifier.
     * @returns {Core.data.Store} Found store instance.
     */
    getCrudStore(storeId) {
        const
            storeInfo = this.getStoreDescriptor(storeId);
        return storeInfo && storeInfo.store;
    }

    forEachCrudStore(fn, thisObj = this) {
        if (!fn) return;

        this.crudStores.every(store =>
            fn.call(thisObj, store.store, store.storeId, store) !== false
        );
    }

    set crudStores(stores) {
        this._crudStores = [];

        this.addCrudStore(stores);

        // Ensure preconfigured stores stay stable at the start of the array when
        // addPrioritizedStore attempts to insert in order. Only featured gantt/scheduler stores
        // must participate in the ordering. If they were configured in, they must not move.
        for (const store of this._crudStores) {
            store.loadPriority = store.syncPriority = 0;
        }
    }

    get crudStores() {
        return this._crudStores;
    }

    get orderedCrudStores() {
        return this._orderedCrudStores;
    }

    set orderedCrudStores(stores) {
        return this._orderedCrudStores = stores;
    }

    set syncApplySequence(stores) {
        this._syncApplySequence = [];

        this.addStoreToApplySequence(stores);
    }

    get syncApplySequence() {
        return this._syncApplySequence;
    }

    internalAddCrudStore(store) {
        const
            me = this;

        let storeInfo;

        // if store instance provided
        if (store instanceof Store) {
            storeInfo = { store };
        }
        else if (typeof store === 'object') {
            // normalize sub-stores (if any)
            if (store.stores) {
                if (!Array.isArray(store.stores)) {
                    store.stores = [store.stores];
                }

                store.stores.forEach((subStore, j) => {
                    let subStoreInfo = subStore;

                    if (typeof subStore === 'string') {
                        subStoreInfo = { storeId : subStore };
                    }

                    // keep reference to the "master" store descriptor
                    subStoreInfo.masterStoreInfo = store;

                    store.stores[j] = subStoreInfo;
                });
            }

            storeInfo = store;
        }
        // if it's a store identifier
        else {
            storeInfo = { store : Store.getStore(store) };
        }

        me.fillStoreDescriptor(storeInfo);

        // store instance
        store = storeInfo.store;

        // if the store has "setCrudManager" hook - use it
        if (store.setCrudManager) {
            store.setCrudManager(me);
        }
        // otherwise decorate the store w/ "crudManager" property
        else {
            store.crudManager = me;
        }

        // Stores have a defaultConfig for pageSize. CrudManager does not support that.
        // TODO: PORT currently no support for paging.
        store.pageSize = null;

        // Prevent AjaxStores from performing their own CRUD operations
        if (me.overrideCrudStoreLoad && store.load) {
            store.load = store.commit = () => {};
        }

        // listen to store changes
        me.bindCrudStoreListeners(store);

        return storeInfo;
    }

    /**
     * Adds a store to the collection.
     *
     *```javascript
     * // append stores to the end of collection
     * crudManager.addCrudStore([
     *     store1,
     *     // storeId
     *     'bar',
     *     // store descriptor
     *     {
     *         storeId : 'foo',
     *         store   : store3
     *     },
     *     {
     *         storeId         : 'bar',
     *         store           : store4,
     *         // to write all fields of modified records
     *         writeAllFields  : true
     *     }
     * ]);
     *```
     *
     * **Note:** Order in which stores are kept in the collection is very essential sometimes.
     * Exactly in this order the loaded data will be put into each store.
     * @param {Core.data.Store|String|Object|Core.data.Store[]|String[]|Object[]} store
     * A store or list of stores. Each store might be specified by its instance, `storeId` or _descriptor_.
     * The _store descriptor_ is an object having following properties:
     * @param {String} store.storeId The store identifier that will be used as a key in requests.
     * @param {Core.data.Store} store.store The store itself.
     * @param {String} [store.idField] The idField of the store. If not specified will be taken from the store model.
     * @param {String} [store.phantomIdField] The field holding unique Ids of phantom records (if store has such model).
     * @param {Boolean} [store.writeAllFields] Set to true to write all fields from modified records
     * @param {Number} [position] The relative position of the store. If `fromStore` is specified the this position will be taken relative to it.
     * If not specified then store(s) will be appended to the end of collection.
     * Otherwise it will be just a position in stores collection.
     *
     * ```javascript
     * // insert stores store4, store5 to the start of collection
     * crudManager.addCrudStore([ store4, store5 ], 0);
     * ```
     *
     * @param {String|Core.data.Store|Object} [fromStore] The store relative to which position should be calculated. Can be defined as a store identifier, instance or descriptor (the result of {@link #function-getStoreDescriptor} call).
     *
     * ```javascript
     * // insert store6 just before a store having storeId equal to 'foo'
     * crudManager.addCrudStore(store6, 0, 'foo');
     *
     * // insert store7 just after store3 store
     * crudManager.addCrudStore(store7, 1, store3);
     * ```
     */
    addCrudStore(store, position, fromStore) {
        if (!store) return;

        if (!Array.isArray(store)) store = [store];

        if (!store.length) return;

        const
            me     = this,
            stores = store.map(me.internalAddCrudStore, me);

        // if no position specified then append stores to the end
        if (typeof position === 'undefined') {
            me.crudStores.push(...stores);
        }
        // if position specified
        else {
            let pos = position;
            // if specified the store relative to which we should insert new one(-s)
            if (fromStore) {
                if (fromStore instanceof Store || typeof fromStore !== 'object') fromStore = me.getStoreDescriptor(fromStore);
                // get its position
                pos += me.crudStores.indexOf(fromStore);
            }
            // insert new store(-s)
            //me.crudStores.splice.apply(me.crudStores, [].concat([pos, 0], stores));
            me.crudStores.splice(pos, 0, ...stores);
        }

        me.orderedCrudStores.push(...stores);

        me.updateCrudStoreIndex();
    }

    // Adds configured scheduler stores to the store collection ensuring correct order
    // unless they're already registered.
    addPrioritizedStore(store) {
        const
            me = this;

        if (!me.hasCrudStore(store)) {
            this.addCrudStore(store, ArrayHelper.findInsertionIndex(store, me.crudStores, storeLoadSortFn));
        }
        if (!me.hasApplySequenceStore(store)) {
            this.addStoreToApplySequence(store, ArrayHelper.findInsertionIndex(store, me.syncApplySequence, storeSyncSortFn));
        }
    }

    hasCrudStore(store) {
        return this.crudStores.some(s => s === store || s.store === store || s.storeId === store);
    }

    /**
     * Removes a store from collection. If the store was registered in alternative sync sequence list
     * it will be removed from there as well.
     *
     * ```javascript
     *    // remove store having storeId equal to "foo"
     *    crudManager.removeCrudStore("foo");
     *
     *    // remove store3
     *    crudManager.removeCrudStore(store3);
     * ```
     *
     * @param {Object|String|Core.data.Store} store The store to remove. Either the store descriptor, store identifier or store itself.
     */
    removeCrudStore(store) {
        const
            me     = this,
            stores = me.crudStores;

        for (let i = 0, l = stores.length; i < l; i++) {
            const
                s = stores[i];
            if (s === store || s.store === store || s.storeId === store) {
                // unbind store listeners
                me.unbindCrudStoreListeners(s.store);

                delete me.crudStoresIndex[s.storeId];
                stores.splice(i, 1);
                if (me.syncApplySequence) {
                    me.removeStoreFromApplySequence(store);
                }

                break;
            }
        }
    }

    //endregion

    //region Store listeners

    bindCrudStoreListeners(store) {
        store.on({
            name    : 'store',
            change  : 'onCrudStoreChange',
            thisObj : this
        });
    }

    unbindCrudStoreListeners() {
        this.detachListeners('store');
    }

    //endregion

    //region Apply sequence

    /**
     * Adds a store to the alternative sync responses apply sequence.
     * By default the order in which sync responses are applied to the stores is the same as they registered in.
     * But this order can be changes either on construction step using {@link #config-syncApplySequence} option
     * or but calling this method.
     *
     * **Please note**, that if the sequence was not initialized before this method call then
     * you will have to do it yourself like this for example:
     *
     *    ```javascript
     *    // alternative sequence was not set for this crud manager
     *    // so let's fill it with existing stores keeping the same order
     *    crudManager.addStoreToApplySequence(crudManager.crudStores);
     *
     *    // and now we can add our new store
     *
     *    // we will load its data last
     *    crudManager.addCrudStore(someNewStore);
     *    // but changes to it will be applied first
     *    crudManager.addStoreToApplySequence(someNewStore, 0);
     *    ```
     * add registered stores to the sequence along with the store(s) you want to add
     *
     * @param {Core.data.Store|Object|Core.data.Store[]|Object[]} store The store to add or its _descriptor_ (or array of stores or descriptors).
     * Where _store descriptor_ is an object having following properties:
     * @param {String} store.storeId The store identifier that will be used as a key in requests.
     * @param {Core.data.Store} store.store The store itself.
     * @param {String} [store.idField] The idField of the store. If not specified will be taken from the store model.
     * @param {String} [store.phantomIdField] The field holding unique Ids of phantom records (if store has such model).

     * @param {Number} [position] The relative position of the store. If `fromStore` is specified the this position will be taken relative to it.
     * If not specified then store(s) will be appended to the end of collection.
     * Otherwise it will be just a position in stores collection.
     *
     *    ```javascript
     *    // insert stores store4, store5 to the start of sequence
     *    crudManager.addStoreToApplySequence([ store4, store5 ], 0);
     *    ```
     * @param {String|Core.data.Store|object} [fromStore] The store relative to which position should be calculated. Can be defined as a store identifier, instance or its descriptor (the result of {@link #function-getStoreDescriptor} call).
     *
     *    ```javascript
     *    // insert store6 just before a store having storeId equal to 'foo'
     *    crudManager.addStoreToApplySequence(store6, 0, 'foo');
     *
     *    // insert store7 just after store3 store
     *    crudManager.addStoreToApplySequence(store7, 1, store3);
     *    ```
     */
    addStoreToApplySequence(store, position, fromStore) {
        if (!store) return;

        if (!Array.isArray(store)) store = [store];

        const
            me   = this,
            // loop over list of stores to add
            data = store.reduce((collection, store) => {
                const
                    s = me.getStoreDescriptor(store);
                if (s) collection.push(s);
                return collection;
            }, []);

        // if no position specified then append stores to the end
        if (typeof position === 'undefined') {
            me.syncApplySequence.push(...data);

            // if position specified
        }
        else {
            let pos = position;
            // if specified the store relative to which we should insert new one(-s)
            if (fromStore) {
                if (fromStore instanceof Store || typeof fromStore !== 'object') fromStore = me.getStoreDescriptor(fromStore);
                // get its position
                pos += me.syncApplySequence.indexOf(fromStore);
            }
            // insert new store(-s)
            //me.syncApplySequence.splice.apply(me.syncApplySequence, [].concat([pos, 0], data));
            me.syncApplySequence.splice(pos, 0, ...data);
        }

        const
            sequenceKeys = me.syncApplySequence.map(desc => desc.storeId);

        me.orderedCrudStores = [...me.syncApplySequence];
        me.crudStores.forEach(desc => {
            if (!sequenceKeys.includes(desc.storeId)) {
                me.orderedCrudStores.push(desc);
            }
        });
    }

    /**
     * Removes a store from the alternative sync sequence.
     *
     *    ```javascript
     *    // remove store having storeId equal to "foo"
     *    crudManager.removeCrudStore("foo");
     *
     *    // remove store3
     *    crudManager.removeCrudStore(store3);
     *    ```
     *
     * @param {Object|String|Core.data.Store} store The store to remove. Either the store descriptor, store identifier or store itself.
     */
    removeStoreFromApplySequence(store) {
        const
            index = this.syncApplySequence.findIndex(s => s === store || s.store === store || s.storeId === store);
        if (index > -1) {
            this.syncApplySequence.splice(index, 1);

            // ordered crud stores list starts with syncApplySequence, we can use same index
            this.orderedCrudStores.splice(index, 1);
        }
    }

    hasApplySequenceStore(store) {
        return this.syncApplySequence.some(s => s === store || s.store === store || s.storeId === store);
    }

    //endregion

    //region Events

    // onNodeRemove(oldParent) {
    //     var treeStore = oldParent && oldParent.getTreeStore();
    //     // "noderemove" event is fired too early and getRemovedRecords() don't not have the removed node yet
    //     // so we wait till tree store "endupdate" event and only then invoke "onCrudStoreChange" method
    //     treeStore && treeStore.on('endupdate', this.onCrudStoreChange, this, { once : true });
    // }

    // onStoreUpdate(store, record, operation, fields) {
    //     if ((!store.isTreeStore || record !== store.getRoot())) {
    //         // If only a single field was changed, make sure it's a persistable field to avoid full scan of the store
    //         // Collapsing/expanding a tree node will trigger this behavior otherwise
    //         var isSingleNonPersistField = fields && fields.length === 1 && record.getField(fields[0]) && !record.getField(fields[0]).persist;
    //
    //         if (!isSingleNonPersistField) {
    //             this.onCrudStoreChange();
    //         }
    //     }
    // }

    // onTreeStoreInsertOrAppend(parent, child) {
    //     if (!child.isRoot()) {
    //         this.onCrudStoreChange();
    //     }
    // }

    onCrudStoreChange() {
        const
            me = this;

        if (me.crudIgnoreUpdates) return;

        /**
         * Fires when any record in a registered stores is changed.
         * ```javascript
         *     crudManager.on('hasChanges', function (crud) {
         *         // enable persist changes button when some store gets changed
         *         saveButton.enable();
         *     });
         * ```
         * @event crudStoreHasChanges
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         */

        if (me.crudStoreHasChanges()) {
            me.trigger('hasChanges');

            if (me.autoSync) {
                // add deferred call if it's not scheduled yet
                if (!me.autoSyncTimerId) {
                    me.autoSyncTimerId = me.setTimeout(() => {
                        me.autoSyncTimerId = null;
                        me.sync().catch(error => {
                            if (!me.isValidResponse(error.rawResponse, error.response)) {
                                throw error;
                            }
                        });
                    }, me.autoSyncTimeout);
                }
            }
        }
        else {
            me.trigger('noChanges');
        }
    }

    async internalOnResponse(requestType, responseText, fetchOptions, options) {
        // reset last requested package ID
        const
            me = this;

        me.activeRequests[requestType] = null;

        const
            response = responseText ? me.decode(responseText) : null;

        if (!response || !response.success) {
            /**
             * Fires when a request fails.
             * @event requestFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {String} requestType The request type (`sync` or `load`).
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions The response options.
             */
            me.trigger('requestFail', { requestType, response, responseText, responseOptions : fetchOptions });
            /**
             * Fires when a {@link #function-load load request} fails.
             * @event loadFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions The response options.
             * @params {Object} options Options provided to the {@link #function-load} method.
             */
            /**
             * Fires when a {@link #function-sync sync request} fails.
             * @event syncFail
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager instance.
             * @param {Object} response The decoded server response object.
             * @param {String} responseText The raw server response text
             * @param {Object} responseOptions The response options.
             */
            me.trigger(requestType + 'Fail', { response, responseOptions : fetchOptions, responseText, options });

            return response;
        }

        /**
         * Fires before server response gets applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeResponseApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {String} requestType The request type (`sync` or `load`).
         * @param {Object} response The decoded server response object.
         */
        /**
         * Fires before loaded data get applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeLoadApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {Object} response The decoded server response object.
         * @param {Object} options Options provided to the {@link #function-load} method.
         */
        /**
         * Fires before sync response data get applied to the stores. Return `false` to prevent data applying.
         * This event can be used for server data preprocessing. To achieve it user can modify the `response` object.
         * @event beforeSyncApply
         * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
         * @param {Object} response The decoded server response object.
         */
        if ((me.trigger('beforeResponseApply', { requestType, response }) !== false) &&
            (me.trigger('before' + StringHelper.capitalizeFirstLetter(requestType) + 'Apply', {
                response,
                options
            }) !== false)) {
            me.crudRevision = response.revision;

            await me.applyResponse(requestType, response, options);

            /**
             * Fires on successful request completion after data gets applied to the stores.
             * @event requestDone
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {String} requestType The request type (`sync` or `load`).
             * @param {Object} response The decoded server response object.
             * @param {Object} responseOptions The server response options.
             */
            me.trigger('requestDone', { requestType, response, responseOptions : fetchOptions });
            /**
             * Fires on successful {@link #function-load load request} completion after data gets loaded to the stores.
             * @event load
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {Object} response The decoded server response object.
             * @param {Object} responseOptions The server response options.
             * @params {Object} options Options provided to the {@link #load} method.
             */
            /**
             * Fires on successful {@link #function-sync sync request} completion.
             * @event sync
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {Object} response The decoded server response object.
             * @param {Object} responseOptions The server response options.
             */
            me.trigger(requestType, { response, responseOptions : fetchOptions, options });

            if (requestType === 'load' || !me.crudStoreHasChanges()) {
                /**
                 * Fires when registered stores get into state when they don't have any
                 * not persisted change. This happens after {@link #function-load load} or {@link #function-sync sync} request
                 * completion. Or this may happen after a record update which turns its fields back to their original state.
                 *
                 * ```javascript
                 *     crudManager.on('nochanges', function (crud) {
                 *         // disable persist changes button when there is no changes
                 *         saveButton.disable();
                 *     });
                 * ```
                 *
                 * @event noChanges
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 */
                me.trigger('noChanges');
            }
        }

        return response;
    }

    async internalOnLoad(responseText, fetchOptions, options) {
        // Successful load request, mark crud manager as loaded
        this.crudLoaded = true;

        return this.internalOnResponse('load', responseText, fetchOptions, options);
    }

    async internalOnSync(responseText, fetchOptions, options) {
        return this.internalOnResponse('sync', responseText, fetchOptions, options);
    }

    //endregion

    //region Changes tracking

    suspendChangesTracking() {
        this.crudIgnoreUpdates++;
    }

    resumeChangesTracking(triggerCheck) {
        if (this.crudIgnoreUpdates && !--this.crudIgnoreUpdates) {
            if (triggerCheck) {
                this.onCrudStoreChange();
            }
        }
    }

    /**
     * Returns `true` if any of registered stores (or some particular store) has non persisted changes.
     *
     *    ```javascript
     *    // if we have any unsaved changes
     *    if (crudManager.crudStoreHasChanges()) {
     *        // persist them
     *        crudManager.sync();
     *    // otherwise
     *    } else {
     *        alert("There are no unsaved changes...");
     *    }
     *    ```
     *
     * @param {String|Core.data.Store} [storeId] The store identifier or store instance to check changes for.
     * If not specified then will check changes for all of the registered stores.
     * @returns {Boolean} `true` if there are not persisted changes.
     */
    crudStoreHasChanges(storeId) {
        if (storeId) {
            const
                store = this.getCrudStore(storeId);
            return store && this.isCrudStoreDirty(store);
        }

        return this.crudStores.some(this.isCrudStoreDirty);

        // for (var i = 0, l = this.crudStores.length; i < l; i++) {
        //     if (this.isCrudStoreDirty(this.crudStores[i].store)) return true;
        // }
        //
        // return false;
    }

    isCrudStoreDirty(store) {
        return store.store.changes != null;
    }

    //endregion

    //region Load

    emitCrudStoreEvents(stores, eventName) {
        const
            event = { action : 'read' + eventName };

        for (const store of this.crudStores) {
            if (stores.includes(store.storeId)) {
                store.store.trigger(eventName, event);
            }
        }
    }

    getLoadPackage(options) {
        const
            pack        = {
                type      : 'load',
                requestId : this.requestId
            },
            stores      = this.crudStores,
            optionsCopy = Object.assign({}, options);

        pack.stores = stores.map(store => {
            const
                opts     = optionsCopy && optionsCopy[store.storeId],
                pageSize = store.pageSize || store.store && store.store.pageSize;

            // TODO: PORT currently no support for remote filters
            // if the store uses remote filtering
            // if (store.store.remoteFilter && filterParam) {
            //
            //     opts = opts || {};
            //
            //     var filters = [];
            //
            //     store.store.getFilters().each(function(f) {
            //         filters.push(f.serialize());
            //     });
            //
            //     // put filters info into the package
            //     opts[filterParam] = filters;
            // }

            // TODO: PORT currently no support for paging
            if (opts || pageSize) {
                const
                    params = Object.assign({
                        storeId : store.storeId,
                        page    : 1
                    }, opts);

                if (pageSize) {
                    params.pageSize = pageSize;
                }

                store.currentPage = params.page;

                // Remove from common request options
                if (opts) {
                    delete optionsCopy[store.storeId];
                }

                return params;
            }

            return store.storeId;
        });

        // Apply common request options
        Object.assign(pack, optionsCopy);

        return pack;
    }

    loadCrudStore(store, data, options) {
        const
            rows = data && data.rows;

        if (options && options.append || data.append) {
            store.add(rows);
        }
        else {
            store.data = rows;
        }

        store.trigger('load', { source : store, data : rows });
    }

    loadDataToCrudStore(storeDesc, data, options) {
        const
            me        = this,
            store     = storeDesc.store,
            // nested stores list
            subStores = storeDesc.stores,
            idField   = storeDesc.idField || 'id', //model && model.meta.idField || 'id',
            isTree    = store.tree,
            rows      = data && data.rows;

        store.__loading = true;

        //TODO: PORT meta data on store?
        // apply server provided meta data to the store
        // const metaData = data?.metaData;
        // if (metaData) {
        //     if (store.applyMetaData) {
        //         store.applyMetaData(metaData);
        //     } else {
        //         store.metaData = metaData;
        //     }
        // }

        if (rows) {
            let subData;

            if (subStores) {
                subData = me.getSubStoresData(rows, subStores, idField, isTree);
            }

            me.loadCrudStore(store, data, options, storeDesc);

            if (subData) {
                // load sub-stores as well (if we have them)
                subData.forEach(sub => {
                    me.loadDataToCrudStore(
                        Object.assign({
                            store : store.getById(sub.id).get(sub.storeDesc.storeId) // TODO: PORT have to check what this does
                        }, sub.storeDesc),
                        sub.data
                    );
                });
            }
        }

        store.__loading = false;
    }

    loadCrudManagerData(response, options = {}) {
        // we don't want reacting on store changes during loading of them
        this.suspendChangesTracking();

        // we load data to the stores in the order they're kept in this.stores array
        this.crudStores.forEach(storeDesc => {
            const
                storeId = storeDesc.storeId,
                data    = response[storeId];

            if (data) {
                this.loadDataToCrudStore(storeDesc, data, options[storeId]);
            }
        });

        this.resumeChangesTracking();
    }

    /**
     * Returns true if the crud manager is currently loading data
     * @property {Boolean}
     * @readonly
     * @category CRUD
     */
    get isCrudManagerLoading() {
        return Boolean(this.activeRequests.load || this.applyingLoadResponse);
    }

    get isLoadingOrSyncing() {
        return Boolean(this.activeRequests.load || this.activeRequests.sync);
    }

    /**
     * Loads data to the stores registered in the crud manager. For example:
     *
     * ```javascript
     * crudManager.load(
     *     // here are request parameters
     *     {
     *         store1 : { append : true, page : 3, smth : 'foo' },
     *         store2 : { page : 2, bar : '!!!' }
     *     }
     * ).then(
     *     () => alert('OMG! It works!'),
     *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
     * );
     * ```
     *
     * ** Note: ** If there is an incomplete load request in progress then system will try to cancel it by calling {@link #function-cancelRequest}.
     * @param {Object} [options] The request parameters. This argument can be omitted like this:
     *
     * ```javascript
     * crudManager.load().then(
     *     () => alert('OMG! It works!'),
     *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
     * );
     * ```
     *
     * When presented it should be an object where keys are store Ids and values are, in turn, objects
     * of parameters related to the corresponding store. And these parameters will be transferred with a load request.
     *
     * ```javascript
     * {
     *     store1 : { page : 3, append : true, smth : 'foo' },
     *     store2 : { page : 2, bar : '!!!' }
     * },
     * ```
     *
     * Additionally for flat stores `append: true` can be specified to add loaded records to the existing records, default is to remove corresponding store's existing records first.
     * **Please note** that for delta loading you can also use an {@link #config-trackResponseType alternative approach}.
     * @returns {Promise} Promise, which is resolved if request was successful.
     * Both the resolve and reject functions are passed a `state` object. State object has following structure:
     *
     *     {
     *         cancelled       : Boolean, // **optional** flag, which is present when promise was rejected
     *         rawResponse     : String,  // raw response from ajax request, either response xml or text
     *         rawResponseText : String,  // raw response text as String from ajax request
     *         response        : Object,  // processed response in form of object
     *         options         : Object   // options, passed to load request
     *     }
     *
     * If promise was rejected by {@link #event-beforeLoad} event, `state` object will have structure:
     *
     *     {
     *         cancelled : true
     *     }
     *
     */
    load(options) {
        const
            me   = this,
            pack = me.getLoadPackage(options);

        return new Promise((resolve, reject) => {
            /**
             * Fires before {@link #function-load load request} is sent. Return `false` to cancel load request.
             * @event beforeLoad
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
             */
            if (me.trigger('beforeLoad', { pack }) !== false) {
                // if another load request is in progress let's cancel it
                if (me.activeRequests.load) {
                    me.cancelRequest(me.activeRequests.load.desc);

                    me.trigger('loadCanceled', { pack });
                }

                me.activeRequests.load = {
                    options,
                    pack,
                    resolve,
                    reject,
                    id   : pack.requestId,
                    desc : me.sendRequest({
                        data    : me.encode(pack),
                        type    : 'load',
                        success : me.onLoadSuccess,
                        failure : me.onLoadFailure,
                        thisObj : me
                    })
                };

                me.emitCrudStoreEvents(pack.stores, 'loadStart');

                me.trigger('loadStart', { pack });
            }
            else {
                /**
                 * Fired after {@link #function-load load request} was canceled by some {@link #event-beforeLoad}
                 * listener or due to incomplete prior load request.
                 * @event loadCanceled
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
                 */
                me.trigger('loadCanceled', { pack });

                me.processPromise(reject, null, {
                    action    : 'load',
                    cancelled : true
                });
            }
        });
    }

    async onLoadSuccess(rawResponse, fetchOptions) {
        let responseText = '';

        const
            request     = this.activeRequests.load,
            { options } = request;

        await rawResponse.text().then(value => responseText = value).catch(nullFn);

        const
            response = await this.internalOnLoad(responseText, fetchOptions, options);

        this.emitCrudStoreEvents(request.pack.stores, 'afterRequest');

        if (response && response.success) {
            request.resolve({ response, rawResponse, responseText, options });
        }
        else {
            this.processPromise(request.reject, request.resolve, {
                action    : 'load',
                cancelled : false,
                response,
                rawResponse,
                responseText,
                options
            });
        }
    }

    async onLoadFailure(rawResponse, fetchOptions = {}) {
        const
            request     = this.activeRequests.load,
            { options } = request,
            signal      = fetchOptions.abortController && fetchOptions.abortController.signal,
            wasAborted  = Boolean(signal && signal.aborted);

        if (!wasAborted) {
            let responseText = '';

            if (rawResponse) {
                await rawResponse.text().then(value => responseText = value).catch(nullFn);
            }

            const response = await this.internalOnLoad(responseText, fetchOptions, options);

            this.emitCrudStoreEvents(request.pack.stores, 'afterRequest');

            this.processPromise(request.reject, null, {
                action    : 'load',
                cancelled : wasAborted,
                response,
                rawResponse,
                responseText,
                options,
                request
            });
        }
    }

    getSubStoresData(rows, subStores, idField, isTree) {
        if (!rows) return;

        const
            result = [];

        function processRow(row, subStores) {
            subStores.forEach(subStore => {
                const
                    storeId = subStore.storeId;

                // if row contains data for this sub-store
                if (row[storeId]) {
                    // keep them for the later loading
                    result.push({
                        id        : row[idField],
                        storeDesc : subStore,
                        data      : row[storeId]
                    });
                    // and remove reference from the row
                    delete row[storeId];
                }
            });
        }

        // if it's a TreeStore
        if (isTree) {
            // loop over nodes
            rows.forEach(row => {
                processRow(row, subStores);

                // also let's grab sub-stores from node children
                const
                    childrenSubData = this.getSubStoresData(row.children, subStores, idField, true);
                if (childrenSubData) {
                    result.push(...childrenSubData);
                }
            });
            // if it's a "flat" store
        }
        else {
            rows.forEach(row => processRow(row, subStores));
        }

        return result;
    }

    //endregion

    //region Changes (prepare, process, get)

    prepareAdded(list, storeInfo) {
        const
            { store, stores }    = storeInfo,
            { isTree }           = store,
            phantomIdField       = storeInfo.phantomIdField || this.phantomIdField,
            phantomParentIdField = storeInfo.phantomParentIdField || this.phantomParentIdField;

        return list.filter(record => record.isValid).map(record => {
            const
                cls  = record.constructor,
                data = Object.assign(record.persistableData, {
                    [phantomIdField] : record.id
                });

            if (isTree) {
                const { parent } = record;

                if (parent && !parent.isRoot && parent.isPhantom) {
                    data[phantomParentIdField] = parent.id;
                }
            }

            if (this.resetIdsBeforeSync) delete ObjectHelper.deletePath(data, cls.getFieldDataSource(cls.idField));

            // if the store has embedded ones
            if (stores) {
                this.processSubStores(record, data, stores);
            }

            return data;
        });
    }

    prepareUpdated(list, storeInfo) {
        const
            { store, stores }    = storeInfo,
            { isTree }           = store,
            writeAllFields       = storeInfo.writeAllFields || (storeInfo.writeAllFields !== false && this.writeAllFields),
            phantomParentIdField = storeInfo.phantomParentIdField || this.phantomParentIdField;

        // TODO: root node included into store.modified
        // need to get rid of it since we don't persist it
        if (storeInfo.store.tree) {
            const
                rootNode = storeInfo.store.rootNode;
            list = list.filter(record => record !== rootNode);
        }

        return list.filter(record => record.isValid).reduce((data, record) => {
            let recordData;

            // write all fields
            if (writeAllFields) {
                recordData = record.persistableData;
            }
            else {
                recordData = record.modificationData;

                // TODO: PORT critical fields
                // critical fields should always be presented
                // const criticalFields = record.getCriticalFields();
                //
                // for (var j = 0; j < criticalFields.length; j++) {
                //     field = criticalFields[j];
                //
                //     if (field.serialize) {
                //         data[field.getName()] = field.serialize(record.get(field.getName()), record);
                //     } else {
                //         data[field.getName()] = record.get(field.getName());
                //     }
                // }
            }

            if (isTree) {
                const { parent } = record;

                if (parent && !parent.isRoot && parent.isPhantom) {
                    recordData[phantomParentIdField] = parent.id;
                }
            }

            // if the store has embedded ones
            if (stores) {
                this.processSubStores(record, recordData, stores);
            }

            // recordData can be null
            if (!ObjectHelper.isEmpty(recordData)) {
                data.push(recordData);
            }

            return data;
        }, []);
    }

    prepareRemoved(list) {
        return list.map(record => {
            const
                cls = record.constructor;

            return ObjectHelper.setPath({}, cls.getFieldDataSource(cls.idField), record.id);
        });
    }

    processSubStores(record, data, stores) {
        stores.forEach(store => {
            const
                id       = store.storeId,
                subStore = record.get(id);
            // if embedded store is assigned to the record
            if (subStore) {
                // let's collect its changes as well
                const
                    changes = this.getCrudStoreChanges(Object.assign({ store : subStore }, store));

                if (changes) {
                    data[id] = Object.assign(changes, { $store : true });
                }
                else {
                    delete data[id];
                }
            }
            else {
                delete data[id];
            }
        });
    }

    getCrudStoreChanges(storeDescriptor) {
        const
            { store } = storeDescriptor;

        let
            added   = store.added.values,
            updated = store.modified.values,
            removed = store.removed.values,
            // sub-stores
            result;

        if (added.length) added = this.prepareAdded(added, storeDescriptor);
        if (updated.length) updated = this.prepareUpdated(updated, storeDescriptor);
        if (removed.length) removed = this.prepareRemoved(removed);

        // if this store has changes
        if (added.length || updated.length || removed.length) {
            result = {};

            if (added.length) result.added = added;
            if (updated.length) result.updated = updated;
            if (removed.length) result.removed = removed;
        }

        return result;
    }

    getChangeSetPackage() {
        const
            pack = {
                type      : 'sync',
                requestId : this.requestId,
                revision  : this.crudRevision
            };

        let found = 0;

        this.crudStores.forEach(store => {
            const
                changes = this.getCrudStoreChanges(store);
            if (changes) {
                found++;
                pack[store.storeId] = changes;
            }
        });

        return found ? pack : null;
    }

    //endregion

    //region Apply

    applyChangesToRecord(record, rawChanges, stores) {
        const
            me                     = this,
            modelClass             = record.constructor,
            { fieldDataSourceMap } = modelClass,
            recProto               = modelClass.prototype,
            changes                = {},
            data                   = record.data,
            done                   = {
                [me.phantomIdField] : true
            };

        let hasChanges;

        // if this store has sub-stores assigned to some fields
        if (stores) {
            // then first we apply changes to that stores
            stores.forEach(store => {
                const
                    name = store.storeId;

                if (Object.prototype.hasOwnProperty.call(rawChanges, name)) {
                    // remember that we processed this field
                    done[name] = true;

                    const
                        subStore = record.get(name);
                    if (subStore) {
                        me.applyChangesToStore(Object.assign({ store : subStore }, store), rawChanges[name]);
                    }
                    else {
                        console.log('Can\'t find store for the response sub-package');
                    }
                }
            });
        }

        const rawChangesFiltered = {};

        for (const key in rawChanges) {
            if (Object.prototype.hasOwnProperty.call(rawChanges, key) && !done[key]) {
                rawChangesFiltered[key] = rawChanges[key];
            }
        }

        const rowChangesSimplePaths = ObjectHelper.pathifyKeys(rawChangesFiltered);

        // Collect the changes into a change set for field names.
        for (const dataSource in rowChangesSimplePaths) {
            const
                field    = fieldDataSourceMap[dataSource],
                propName = field ? field.name : dataSource,
                value    = modelClass.processField(propName, rowChangesSimplePaths[dataSource]),
                oldValue = dataSource in recProto ? record[propName] : ObjectHelper.getPath(data, dataSource);

            if (!ObjectHelper.isEqual(oldValue, value)) {
                hasChanges = true;
                changes[propName] = value;
            }
        }

        if (hasChanges) {
            me.suspendChangesTracking();

            // Set each field separately until https://app.assembla.com/spaces/bryntum/tickets/9123 is fixed.
            for (const fieldName in changes) {
                record[fieldName] = changes[fieldName];
            }

            // TODO: Re-enable record.set when https://app.assembla.com/spaces/bryntum/tickets/9123 is fixed.
            // Set fields one go
            // record.set(changes);
            me.resumeChangesTracking();
        }

        // Clear changes only for the passed record,
        // not descendant nodes.
        // TODO: they *might* also be genuinely new
        // so might have to stay.
        record.clearChanges(true, false);
    }

    applyRemovals(store, removed, context) {
        const
            {
                removed : removedStash,
                modelClass
            }              = store,
            findByIdFn     = context.findByIdFn,
            removeRecordFn = context.removeRecordFn,
            dataSource     = modelClass.getFieldDataSource(modelClass.idField);

        let applied = 0;

        removed.forEach(remove => {
            const
                id = remove[dataSource];

            let done = false;

            // just remove the record from the removed stash
            if (removedStash.includes(id)) {
                removedStash.remove(id);
                done = true;
                // number of removals applied
                applied++;
            }

            // if responded removed record isn`t found in store.removed
            // probably don't removed on the client side yet (server driven removal)
            if (!done) {
                const
                    record = findByIdFn(id);

                if (record) {
                    this.suspendChangesTracking();

                    removeRecordFn(record);

                    removedStash.remove(record);
                    // number of removals applied
                    applied++;

                    this.resumeChangesTracking();
                }
                else {
                    console.log('Can\'t find record to remove from the response package');
                }
            }
        });

        return applied;
    }

    getApplyChangesToStoreHelpers(store) {
        // if it's a tree store
        if (store.tree) {
            return {
                findByPhantomFn : id => store.getById(id),
                findByIdFn      : id => store.getById(id),
                // TODO: need to support parentIdProperty
                addRecordFn     : data => {
                    const
                        parent = (data.parentId && store.getById(data.parentId)) || store.rootNode;

                    return parent.appendChild(data);
                },
                removeRecordFn : (record) => record.remove()
            };

            // plain store
        }
        else {
            return {
                findByPhantomFn : id => store.getById(id),
                findByIdFn      : id => store.getById(id),
                addRecordFn     : data => store.add(data)[0],
                removeRecordFn  : record => store.remove(record)
            };
        }
    }

    applyChangesToStore(storeDesc, storeResponse) {
        const
            me                = this,
            phantomIdField    = storeDesc.phantomIdField || me.phantomIdField,
            store             = storeDesc.store,
            { modelClass }    = store,
            idDataSource      = modelClass.getFieldDataSource(modelClass.idField),
            {
                findByPhantomFn,
                findByIdFn,
                addRecordFn,
                removeRecordFn
            }                 = me.getApplyChangesToStoreHelpers(store),
            { rows, removed } = storeResponse;

        // process added/updated records
        if (rows) {
            // sub-stores
            const
                stores = storeDesc.stores;

            rows.forEach(data => {
                const
                    phantomId = data[phantomIdField],
                    id        = ObjectHelper.getPath(data, idDataSource);

                let record = null;

                // if phantomId is provided then we will use it to find added record
                if (phantomId != null) {
                    record = findByPhantomFn(phantomId);
                }
                // if id is provided then we will use it to find updated record
                else if (id != null) {
                    record = findByIdFn(id);
                }

                if (record) {
                    me.applyChangesToRecord(record, data, stores, store);
                }
                else {
                    me.suspendChangesTracking();

                    // create new record in the store
                    record = addRecordFn(data);

                    me.resumeChangesTracking();

                    record.clearChanges();
                }
            });
        }

        // process removed records
        if (removed && me.applyRemovals(store, removed, {
            findByIdFn,
            removeRecordFn
        })) {
            store.trigger('dataChanged', { source : store });
        }
    }

    applySyncResponse(response) {
        const
            me     = this,
            stores = me.orderedCrudStores;

        me.applyingSyncResponse = true;

        for (const store of stores) {
            const
                storeResponse = response[store.storeId];

            if (storeResponse) {
                me.applyChangesToStore(store, storeResponse);
            }
        }

        me.applyingSyncResponse = false;
    }

    applyLoadResponse(response, options) {
        this.applyingLoadResponse = true;

        this.loadCrudManagerData(response, options);

        this.applyingLoadResponse = false;
    }

    async applyResponse(requestType, response, options) {
        // in trackResponseType we check response type before deciding how to react on the response
        if (this.trackResponseType) {
            requestType = response.type || requestType;
        }

        switch (requestType) {
            case 'load' :
                this.applyLoadResponse(response, options);
                break;
            case 'sync' :
                this.applySyncResponse(response);
                break;
        }
    }

    //endregion

    /**
     * Generates unique request identifier.
     * @internal
     * @template
     * @return {Number} The request identifier.
     */
    get requestId() {
        return Number.parseInt(`${Date.now()}${(this._requestId++)}`);
    }

    /**
     * Persists changes made on the registered stores to the server. Usage:
     *
     * ```javascript
     * // persist and run a callback on request completion
     * crud.sync().then(
     *     () => console.log("Changes saved..."),
     *     ({ response, cancelled }) => console.log(`Error: ${cancelled ? 'Cancelled' : response.message}`)
     * );
     * ```
     *
     * ** Note: ** If there is an incomplete sync request in progress then system will queue the call and delay it until previous request completion.
     * In this case {@link #event-syncDelayed} event will be fired.
     *
     * ** Note: ** Please take a look at {@link #config-autoSync} config. This option allows to persist changes automatically after any data modification.
     * @returns {Promise} Promise, which is resolved if request was successful.
     * Both the resolve and reject functions are passed a `state` object. State object has following structure:
     *
     *     {
     *         cancelled       : Boolean, // **optional** flag, which is present when promise was rejected
     *         rawResponse     : String,  // raw response from ajax request, either response xml or text
     *         rawResponseText : String,  // raw response text as String from ajax request
     *         response        : Object,  // processed response in form of object
     *     }
     *
     * If promise was rejected by {@link #event-beforeSync} event, `state` object will have structure:
     *
     *     {
     *         cancelled : true
     *     }
     *
     */
    sync() {
        const
            me = this;

        if (me.activeRequests.sync) {
            // let's delay this call and start it only after server response
            /**
             * Fires after {@link #function-sync sync request} was delayed due to incomplete previous one.
             * @event syncDelayed
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {Object} arguments The arguments of {@link #function-sync} call.
             */
            me.trigger('syncDelayed');

            // Queue sync request after current one
            return me.activeSyncPromise = me.activeSyncPromise.then(() => me.sync(), () => me.sync());
        }

        // Store current request promise. While this one is pending, all following sync requests will create chain
        // of sequential promises
        return me.activeSyncPromise = new Promise((resolve, reject) => {
            // get current changes set package
            const
                pack = me.getChangeSetPackage();

            // if no data to persist we resolve immediately
            if (!pack) {
                resolve(null);
                return;
            }

            /**
             * Fires before {@link #function-sync sync request} is sent. Return `false` to cancel sync request.
             *
             * ```javascript
             *     crudManager.on('beforesync', function() {
             *        // cannot persist changes before at least one record is added
             *        // to the `someStore` store
             *        if (!someStore.getCount()) return false;
             *     });
             * ```
             * @event beforeSync
             * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
             * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
             */
            if (me.trigger('beforeSync', { pack }) !== false) {

                me.trigger('syncStart', { pack });

                // keep active request details
                me.activeRequests.sync = {
                    pack,
                    resolve,
                    reject,
                    id   : pack.requestId,
                    desc : me.sendRequest({
                        data    : me.encode(pack),
                        type    : 'sync',
                        success : me.onSyncSuccess,
                        failure : me.onSyncFailure,
                        thisObj : me
                    })
                };
            }
            else {
                // if this sync was canceled let's fire event about it
                /**
                 * Fires after {@link #function-sync sync request} was canceled by some {@link #event-beforeSync} listener.
                 * @event syncCanceled
                 * @param {Scheduler.crud.AbstractCrudManager} source The CRUD manager.
                 * @param {Object} pack The data package which contains data for all stores managed by the crud manager.
                 */
                me.trigger('syncCanceled', { pack });

                this.processPromise(reject, null, {
                    action    : 'sync',
                    cancelled : true
                });
            }
        });
    }

    async onSyncSuccess(rawResponse, fetchOptions) {
        let responseText = '';

        await rawResponse.text().then(value => responseText = value).catch(nullFn);

        const
            request  = this.activeRequests.sync,
            response = await this.internalOnSync(responseText, fetchOptions);

        if (response && response.success) {
            request.resolve({ response, rawResponse, responseText, request });
        }
        else {
            this.processPromise(request.reject, request.resolve, {
                action    : 'sync',
                cancelled : false,
                response,
                rawResponse,
                responseText,
                request
            });
        }
    }

    async onSyncFailure(rawResponse, fetchOptions = {}) {
        const
            request     = this.activeRequests.sync,
            { options } = request,
            signal      = fetchOptions.abortController && fetchOptions.abortController.signal,
            wasAborted  = Boolean(signal && signal.aborted);

        if (!wasAborted) {
            let responseText = '';

            if (rawResponse) {
                await rawResponse.text().then(value => responseText = value).catch(nullFn);
            }

            const response = await this.internalOnSync(responseText, fetchOptions, options);

            this.processPromise(request.reject, null, {
                action    : 'sync',
                cancelled : wasAborted,
                response,
                rawResponse,
                responseText,
                options,
                request
            });
        }
    }

    /**
     * Commits all records changes of all the registered stores.
     */
    commitCrudStores() {
        this.crudStores.forEach(store => store.store.commit());
    }

    /**
     * Rejects all records changes on all stores and re-insert any records that were removed locally. Any phantom records will be removed.
     */
    rejectCrudStores() {
        this.orderedCrudStores.forEach(store => store.store.clearChanges());
    }

    /**
     * Removes all stores and cancels active requests.
     */
    doDestroy() {
        const
            me = this;

        me.activeRequests.load && me.cancelRequest(me.activeRequests.load.desc);
        me.activeRequests.sync && me.cancelRequest(me.activeRequests.sync.desc);

        while (me.crudStores.length > 0) {
            me.removeCrudStore(me.crudStores[0]);
        }

        clearTimeout(me.autoSyncTimerId);

        me.destroyed = true;

        super.doDestroy && super.doDestroy();
    }

    // set crudRevision(value) {
    //     debugger
    //     this._crudRevision = value;
    // }

    // get crudRevision() {
    //     return this._crudRevision;
    // }

    /**
     * Check if response is valid
     * @param {Response} rawResponse raw
     * @param {Object} response parsed response
     * @return {Boolean} truthy when response is `ok` or `status` is 500 or 404 and it is successfully parsed
     * @private
     */
    isValidResponse(rawResponse, response) {
        return rawResponse && (rawResponse.ok && response || [500, 404].includes(rawResponse.status));
    }

    processPromise(reject, resolve, context) {
        const
            { cancelled, action, rawResponse, response } = context;

        // Call `resolve()` instead of `reject()` for valid response. These errors are notified by API events
        if (resolve && this.isValidResponse(rawResponse, response)) {
            resolve(context);
        }
        else {
            const
                message = `${StringHelper.capitalizeFirstLetter(action)} ${cancelled ? 'canceled' : 'failed'}`,
                error   = new Error(message);
            Object.assign(error, context);
            reject(error);
        }
    }
};
