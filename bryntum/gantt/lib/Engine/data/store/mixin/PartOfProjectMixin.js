const hasMixin = Symbol('PartOfProjectStoreMixin');
export const PartOfProjectStoreMixin = (base) => {
    class PartOfProjectStoreMixin extends base {
        [hasMixin]() { }
        calculateProject() {
            return this.project;
        }
        loadData(data) {
            super.loadData(data);
            const project = this.getProject();
            project && project.trigger('storerefresh', { store: this });
        }
    }
    return PartOfProjectStoreMixin;
};
export const hasPartOfProjectStoreMixin = (store) => Boolean(store && store[hasMixin]);
//# sourceMappingURL=PartOfProjectMixin.js.map