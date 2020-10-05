import Base from '../../../Core/Base.js';
import AjaxHelper from '../../../Core/helper/AjaxHelper.js';

/**
 * @module Scheduler/crud/transport/AjaxTransport
 */

/**
 * Implements data transferring functional that can be used for {@link Scheduler.crud.AbstractCrudManager} super classing.
 * Uses the fetch API for transport, https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 *
 * @example
 * // create a new CrudManager using AJAX as a transport system and JSON for encoding
 * class MyCrudManager extends AjaxTransport(JsonEncode(AbstractCrudManager)) {}
 *
 * @abstract
 * @mixin
 */
export default Target => class AjaxTransport extends (Target || Base) {
    /**
     * Configuration of the AJAX requests used by __Crud Manager__ to communicate with a server-side.
     *
     * ```javascript
     * transport : {
     *     load : {
     *         url       : 'http://mycool-server.com/load.php',
     *         // HTTP request parameter used to pass serialized "load"-requests
     *         paramName : 'data',
     *         // pass extra HTTP request parameter
     *         params    : {
     *             foo : 'bar'
     *         }
     *     },
     *     sync : {
     *         url     : 'http://mycool-server.com/sync.php',
     *         // specify Content-Type for requests
     *         headers : {
     *             'Content-Type' : 'application/json'
     *         }
     *     }
     * }
     *```
     * Since the class uses Fetch API you can use
     * any its [Request interface](https://developer.mozilla.org/en-US/docs/Web/API/Request) options:
     *
     * ```javascript
     * transport : {
     *     load : {
     *         url         : 'http://mycool-server.com/load.php',
     *         // HTTP request parameter used to pass serialized "load"-requests
     *         paramName   : 'data',
     *         // pass few Fetch API options
     *         method      : 'GET',
     *         credentials : 'include',
     *         cache       : 'no-cache
     *     },
     *     sync : {
     *         url         : 'http://mycool-server.com/sync.php',
     *         // specify Content-Type for requests
     *         headers     : {
     *             'Content-Type' : 'application/json'
     *         },
     *         credentials : 'include'
     *     }
     * }
     *```
     *
     * An object where you can set the following possible properties:
     * @config {Object} transport
     * @property {Object} transport.load Load requests configuration:
     * @property {String} transport.load.url URL to request for data loading.
     * @property {String} [transport.load.method='GET'] HTTP method to be used for load requests.
     * @property {String} [transport.load.paramName='data'] Name of the parameter that will contain a serialized `load` request.
     * The value is mandatory for requests using `GET` method (default for `load`) so if the value is not provided `data` string is used as default.
     * This value is optional for HTTP methods like `POST` and `PUT`, the request body will be used for data transferring in these cases.
     * @property {Object} [transport.load.params] An object containing extra HTTP parameters to pass to the server when sending a `load` request.
     *
     * ```javascript
     * transport : {
     *     load : {
     *         url       : 'http://mycool-server.com/load.php',
     *         // HTTP request parameter used to pass serialized "load"-requests
     *         paramName : 'data',
     *         // pass extra HTTP request parameter
     *         // so resulting URL will look like: http://mycool-server.com/load.php?userId=123456&data=...
     *         params    : {
     *             userId : '123456'
     *         }
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.load.headers] An object containing headers to pass to each server request.
     *
     * ```javascript
     * transport : {
     *     load : {
     *         url       : 'http://mycool-server.com/load.php',
     *         // HTTP request parameter used to pass serialized "load"-requests
     *         paramName : 'data',
     *         // specify Content-Type for "load" requests
     *         headers   : {
     *             'Content-Type' : 'application/json'
     *         }
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.load.fetchOptions] **DEPRECATED:** Any Fetch API options can be simply defined on the upper configuration level:
     * ```javascript
     * transport : {
     *     load : {
     *         url          : 'http://mycool-server.com/load.php',
     *         // HTTP request parameter used to pass serialized "load"-requests
     *         paramName    : 'data',
     *         // Fetch API options
     *         method       : 'GET',
     *         credentials  : 'include'
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.load.requestConfig] **DEPRECATED:** The config options can be defined on the upper configuration level.
     * @property {Object} transport.sync Sync requests (`sync` in further text) configuration:
     * @property {String} transport.sync.url URL to request for `sync`.
     * @property {String} [transport.sync.method='POST'] HTTP request method to be used for `sync`.
     * @property {String} [transport.sync.paramName=undefined] Name of the parameter in which `sync` data will be transferred.
     * This value is optional for requests using methods like `POST` and `PUT`, the request body will be used for data transferring in this case (default for `sync`).
     * And the value is mandatory for requests using `GET` method (if the value is not provided `data` string will be used as fallback).
     * @property {Object} [transport.sync.params] HTTP headers to pass with an HTTP request handling `sync`.
     *
     * ```javascript
     * transport : {
     *     sync : {
     *         url    : 'http://mycool-server.com/sync.php',
     *         // extra HTTP request parameter
     *         params : {
     *             userId : '123456'
     *         }
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.sync.headers] HTTP headers to pass with an HTTP request handling `sync`.
     *
     * ```javascript
     * transport : {
     *     sync : {
     *         url     : 'http://mycool-server.com/sync.php',
     *         // specify Content-Type for "sync" requests
     *         headers : {
     *             'Content-Type' : 'application/json'
     *         }
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.sync.fetchOptions] **DEPRECATED:** Any Fetch API options can be simply defined on the upper configuration level:
     * ```javascript
     * transport : {
     *     sync : {
     *         url         : 'http://mycool-server.com/sync.php',
     *         credentials : 'include'
     *     },
     *     ...
     * }
     * ```
     * @property {Object} [transport.sync.requestConfig] **DEPRECATED:** The config options can be defined on the upper configuration level.
     */

    static get defaultMethod() {
        return {
            load : 'GET',
            sync : 'POST'
        };
    }

    /**
     * Cancels a sent request.
     * @param {Promise} requestPromise The Promise object wrapping the Request to be cancelled.
     * The _requestPromise_ is the value returned from the corresponding {@link #function-sendRequest} call.
     */
    cancelRequest(requestPromise) {
        requestPromise.abort();
    }

    shouldUseBodyForRequestData(packCfg, method, paramName) {
        return !(method === 'HEAD' || method === 'GET') && !paramName;
    }

    /**
     * Sends a __Crud Manager__ request to the server.
     * @param {Object} request The request configuration object having following properties:
     * @param {String} request.type The request type. Either `load` or `sync`.
     * @param {String} request.data The encoded __Crud Manager__ request data.
     * @param {Function} request.success A function to be started on successful request transferring.
     * @param {String} request.success.rawResponse `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     * @param {Function} request.failure A function to be started on request transfer failure.
     * @param {String} request.failure.rawResponse `Response` object returned by the [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
     * @param {Object} request.thisObj `this` reference for the above `success` and `failure` functions.
     * @return {Promise} The fetch Promise object.
     * @fires beforesend
     */
    sendRequest(config) {
        const
            me              = this,
            { data }        = config,
            transportConfig = me.transport[config.type] || {},
            // clone parameters defined for this type of request
            requestConfig   = Object.assign({}, transportConfig, transportConfig.requestConfig);

        requestConfig.method = requestConfig.method || AjaxTransport.defaultMethod[config.type];
        requestConfig.params = requestConfig.params || {};

        let { paramName } = requestConfig;

        // transfer package in the request body for some types of HTTP requests
        if (me.shouldUseBodyForRequestData(transportConfig, requestConfig.method, paramName)) {
            requestConfig.body = data;

            // for requests having body we set Content-Type to 'application/json' by default
            requestConfig.headers = requestConfig.headers || {};
            requestConfig.headers['Content-Type'] = requestConfig.headers['Content-Type'] || 'application/json';
        }
        else {
            // when we don't use body paramName is mandatory so fallback to 'data' as name
            paramName = paramName || 'data';

            requestConfig.params[paramName] = data;
        }

        if (!requestConfig.url) {
            throw new Error('Trying to request without URL specified');
        }

        // sanitize request config
        delete requestConfig.requestConfig;
        delete requestConfig.paramName;

        /**
         * Fires before a request is sent to the server.
         *
         * ```javascript
         * crudManager.on('beforeSend', function ({ params, type }) {
         *     // let's set "sync" request parameters
         *     if (type == 'sync') {
         *         // dynamically depending on "flag" value
         *         if (flag) {
         *             params.foo = 'bar';
         *         }
         *         else {
         *             params.foo = 'smth';
         *         }
         *     }
         * });
         * ```
         * @event beforeSend
         * @param {Scheduler.crud.AbstractCrudManager} crudManager The CRUD manager.
         * @param {Object} params HTTP request params to be passed in the request URL.
         * @param {String} type CrudManager request type (`load`/`sync`)
         * @param {Object} requestConfig Configuration object for Ajax request call
         */
        me.trigger('beforeSend', { params : requestConfig.params, type : config.type, requestConfig, config });

        // AjaxHelper.fetch call it "queryParams"
        requestConfig.queryParams = requestConfig.params;

        delete requestConfig.params;

        const
            fetchOptions = Object.assign({}, requestConfig, requestConfig.fetchOptions),
            ajaxPromise = AjaxHelper.fetch(requestConfig.url, fetchOptions);

        ajaxPromise.catch(error => {
            const signal = fetchOptions.abortController && fetchOptions.abortController.signal;

            if (signal && !signal.aborted) {
                console.warn(error);
            }
        }).then(response => {
            if (response && response.ok) {
                config.success && config.success.call(config.thisObj || me, response, fetchOptions);
            }
            else {
                config.failure && config.failure.call(config.thisObj || me, response, fetchOptions);
            }
        });

        return ajaxPromise;
    }
};
