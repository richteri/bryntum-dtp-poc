//---------------------------------------------------------------------------------------------------------------------
export const DEBUG = false

export const DEBUG_MODE = 'THROW'

export const debug = (e : Error) => {
    if (!DEBUG) return

    if (DEBUG_MODE === 'THROW')
        throw e
    else
        debugger
}


//---------------------------------------------------------------------------------------------------------------------
export const warn = (e : Error) => {
    if (typeof console !== 'undefined') console.warn(e)
}


