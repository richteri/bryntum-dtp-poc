export const stripDuplicates = (array) => {
    const seen = new Map();
    return array.filter(el => {
        if (seen.has(el))
            return false;
        seen.set(el, true);
        return true;
    });
};
//# sourceMappingURL=StripDuplicates.js.map