export const uppercaseFirst = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
export const isAtomicValue = (value) => Object(value) !== value;
export const lazyBuild = (target, property, value) => {
    Object.defineProperty(target, property, { value });
    return value;
};
export const preWalk = (data, childrenFn, fn) => {
    let walkStack = [data], node, children;
    while (walkStack.length) {
        node = walkStack.pop();
        fn(node);
        children = childrenFn(node);
        if (children) {
            walkStack = walkStack.concat(children.slice().reverse());
        }
    }
};
//# sourceMappingURL=Helper.js.map