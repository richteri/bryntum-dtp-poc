export const ChronoModelMixin = (base) => {
    class ChronoModelMixin extends base {
        construct(config, ...args) {
            this.constructor.exposeProperties();
            const commonConfig = {};
            const chronoConfig = {};
            this.originalData = (config = config || {});
            for (let key in config) {
                const fieldDefinition = this.getFieldDefinitionFromDataSource(key);
                const field = fieldDefinition ? fieldDefinition.name : key;
                const chronoField = this.$entity.getField(field);
                if (!chronoField || field == 'expanded' || field == 'children')
                    commonConfig[key] = config[key];
                else {
                    chronoConfig[field] = config[key];
                }
            }
            super.construct(commonConfig, ...args);
            Object.assign(this, chronoConfig);
        }
        copy(newId = null, proposed = true) {
            const copy = super.copy(newId);
            proposed && this.forEachFieldAtom((atom, fieldName) => {
                copy.$[fieldName].put(atom.get());
            });
            return copy;
        }
    }
    return ChronoModelMixin;
};
//# sourceMappingURL=ChronoModelMixin.js.map