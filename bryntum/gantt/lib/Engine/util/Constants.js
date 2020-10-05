export const MIN_DATE = new Date(-8640000000000000);
export const MAX_DATE = new Date(8640000000000000);
export const isDateFinite = (date) => {
    if (!date)
        return false;
    const time = date.getTime();
    return time !== MIN_DATE.getTime() && time !== MAX_DATE.getTime();
};
//# sourceMappingURL=Constants.js.map