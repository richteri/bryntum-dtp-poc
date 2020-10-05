export const DEBUG = false;
export const DEBUG_MODE = 'THROW';
export const debug = (e) => {
    if (!DEBUG)
        return;
    if (DEBUG_MODE === 'THROW')
        throw e;
    else
        debugger;
};
export const warn = (e) => {
    if (typeof console !== 'undefined')
        console.warn(e);
};
//# sourceMappingURL=Debug.js.map