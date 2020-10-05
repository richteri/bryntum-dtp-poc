/**
 * @private
 * Empty function, does nothing
 */
export type emptyFn = () => void
export const emptyFn : emptyFn = () => {}

/**
 * @private
 * Identity function
 */
export type identityFn = (v : any) => typeof v
export const identityFn : identityFn = (v : any) => v

export const isNotNumber = (value : any) => Number(value) !== value

export const delay = (value : number) => new Promise(resolve => setTimeout(resolve, value))
