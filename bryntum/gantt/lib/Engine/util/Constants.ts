// http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1

export const MIN_DATE : Date = new Date(-8640000000000000)

export const MAX_DATE : Date = new Date(8640000000000000)

export const isDateFinite = (date : Date) : boolean => {
    if (!date) return false

    const time = date.getTime()

    return time !== MIN_DATE.getTime() && time !== MAX_DATE.getTime()
}
