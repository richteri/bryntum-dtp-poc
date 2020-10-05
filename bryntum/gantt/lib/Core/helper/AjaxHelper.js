/**
 * @module Core/helper/AjaxHelper
 */

const
    paramValueRegExp = /^(\w+)=(.*)$/,
    parseParams      = function(paramString) {
        const
            result = {},
            params = paramString.split('&');

        // loop through each 'filter={"field":"name","operator":"=","value":"Sweden","caseSensitive":true}' string
        // So we cannot use .split('=')
        for (const nameValuePair of params) {
            const
                [match, name, value] = paramValueRegExp.exec(nameValuePair),
                decodedName          = decodeURIComponent(name),
                decodedValue         = decodeURIComponent(value);

            if (match) {
                let paramValue = result[decodedName];

                if (paramValue) {
                    if (!Array.isArray(paramValue)) {
                        paramValue = result[decodedName] = [paramValue];
                    }
                    paramValue.push(decodedValue);
                }
                else {
                    result[decodedName] = decodedValue;
                }
            }
        }
        return result;
    };
/**
 * Simplifies Ajax requests. Uses fetch & promises.
 *
 * ```javascript
 * AjaxHelper.get('some-url').then(response => {
 *     // process request response here
 * });
 * ```
 *
 * Uploading file to server via FormData interface.
 * Please visit <https://developer.mozilla.org/en-US/docs/Web/API/FormData> for details.
 *
 * ```javascript
 * const formData = new FormData();
 * formData.append('file', 'fileNameToUpload');
 * AjaxHelper.post('file-upload-url', formData).then(response => {
 *     // process request response here
 * });
 * ```
 *
 */
export default class AjaxHelper {
    /**
     * Make a request (using GET) to the specified url.
     * @param {String} url Url
     * @param {Object} [options] The options for the `fetch` API. Please see <https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch> for details
     * @param {Object} [options.queryParams] A key-value pair Object containing the params to add to the query string
     * @param {Object} [options.headers] Any headers you want to add to your request, contained within a `Headers object or an object literal with ByteString values
     * @param {Object} [options.body] Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, or USVString object. Note that a request using the GET or HEAD method cannot have a body.
     * @param {Object} [options.mode] The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
     * @param {Object} [options.credentials] The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided
     * @param {Object} [options.parseJson] Specify `true` to parses the response and attach the resulting object to the `Response` object as `parsedJson`
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     */
    static get(url, options) {
        return this.fetch(url, options);
    }

    /**
     * POST data to the specified URL.
     * @param {String} url The URL
     * @param {String|Object|FormData} payload The data to post. If an object is supplied, it will be stringified
     * @param {Object} options The options for the `fetch` API. Please see <https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch> for details
     * @param {Object} [options.queryParams] A key-value pair Object containing the params to add to the query string
     * @param {Object} [options.headers] Any headers you want to add to your request, contained within a `Headers object or an object literal with ByteString values
     * @param {Object} [options.body] Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, or USVString object. Note that a request using the GET or HEAD method cannot have a body.
     * @param {Object} [options.mode] The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
     * @param {Object} [options.credentials] The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided
     * @param {Object} [options.parseJson] Specify `true` to parses the response and attach the resulting object to the `Response` object as `parsedJson`
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     */
    static post(url, payload, options = {}) {
        if (!(payload instanceof FormData) && !(typeof payload === 'string')) {
            payload = JSON.stringify(payload);

            options.headers = options.headers || {};

            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        }

        return this.fetch(url, Object.assign({
            method : 'POST',
            body   : payload
        }, options));
    }

    /**
     * Fetch the specified resource using the `fetch` API.
     * @param {String} url object to fetch
     * @param {Object} options The options for the `fetch` API. Please see <https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch> for details
     * @param {Object} [options.method] The request method, e.g., GET, POST
     * @param {Object} [options.queryParams] A key-value pair Object containing the params to add to the query string
     * @param {Object} [options.headers] Any headers you want to add to your request, contained within a `Headers object or an object literal with ByteString values
     * @param {Object} [options.body] Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, or USVString object. Note that a request using the GET or HEAD method cannot have a body.
     * @param {Object} [options.mode] The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
     * @param {Object} [options.credentials] The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided
     * @param {Object} [options.parseJson] Specify `true` to parses the response and attach the resulting object to the `Response` object as `parsedJson`
     * @returns {Promise} The fetch Promise, which can be aborted by calling a special `abort` method
     */
    static fetch(url, options = {}) {
        const controller = new AbortController();

        // Need to assign AbortController individually, because IE11 polyfill of the Fetch API deletes 'signal' property on fetchOptions object
        Object.assign(options, {
            abortController : controller,
            signal          : controller.signal
        });

        if (!('credentials' in options)) {
            options.credentials = 'include';
        }

        if (options.queryParams) {
            const params = Object.entries(options.queryParams);
            if (params.length) {
                url += '?' + params.map(([param, value]) =>
                    `${param}=${encodeURIComponent(value)}`
                ).join('&');
            }
        }

        //<debug>
        if (url.match(/undefined|null|\[object/)) {
            throw new Error('Incorrect URL: ' + url);
        }
        //</debug>

        // Promise that will be resolved either when network request is finished or when json is parsed
        const promise = new Promise((resolve, reject) => {
            fetch(url, options).then(
                response => {
                    if (options.parseJson) {
                        response.json().then(json => {
                            response.parsedJson = json;
                            resolve(response);
                        }).catch(error => {
                            response.parsedJson = null;
                            response.error = error;
                            reject(response);
                        });
                    }
                    else {
                        resolve(response);
                    }
                }
            ).catch(error => {
                error.stack = promise.stack;

                reject(error);
            });
        });

        promise.stack = new Error().stack;

        promise.abort = function() {
            controller.abort();
        };

        return promise;
    }

    /**
     * Registers the passed URL to return the passed mocked up Fetch Response object to the
     * AjaxHelper's promise resolve function.
     * @param {String} url The url to return mock data for
     * @param {Object|Function} response A mocked up Fetch Response object which must contain
     * at least a `responseText` property, or a function to which the `url` and a `params` object
     * and the `Fetch` `options` object is passed which returns that.
     * @param {String} response.responseText The data to return.
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay=100] resolve the Promise after this number of milliseconds.
     */
    static mockUrl(url, response) {
        const me = this;

        (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response;

        // Inject the override into the AjaxHelper instance
        if (!AjaxHelper.originalFetch) {
            AjaxHelper.originalFetch = AjaxHelper.fetch;
        }
        AjaxHelper.fetch = me.mockAjaxFetch.bind(me);
    }

    static mockAjaxFetch(url, options) {
        let urlAndParams = url.split('?'),
            result       = this.mockAjaxMap[urlAndParams[0]],
            parsedJson   = null;

        if (result) {
            if (typeof result === 'function') {
                result = result(urlAndParams[0], urlAndParams[1] && parseParams(urlAndParams[1]), options);
            }
            try {
                parsedJson = options.parseJson && JSON.parse(result.responseText);
            }
            catch (error) {
                parsedJson   = null;
                result.error = error;
            }

            result = Object.assign({
                status     : 200,
                ok         : true,
                headers    : new Headers(),
                statusText : 'OK',
                url        : url,
                parsedJson : parsedJson,
                text       : () => new Promise((resolve) => {
                    resolve(result.responseText);
                }),
                json : () => new Promise((resolve) => {
                    resolve(parsedJson);
                })
            }, result);

            return new Promise(function(resolve, reject) {
                if (result.synchronous) {
                    resolve(result);
                }
                else {
                    setTimeout(function() {
                        resolve(result);
                    }, ('delay' in result ? result.delay : 100));
                }
            });
        }
        else {
            return AjaxHelper.originalFetch(url, options);
        }
    }
}
