export class Base {
    initialize(props) {
        props && Object.assign(this, props);
    }
    static new(props) {
        const instance = new this();
        instance.initialize(props);
        return instance;
    }
}
//# sourceMappingURL=Mixin.js.map