/**
 * @module Core/test/docs/ChildMixin
 */

import Base from '../../Base.js';

/**
 * Mixin for children of TestDocsBase.
 * This class is required to check how docs are generated.
 *
 * @internal
 * @mixin
 */
export default class ChildMixin extends Base {
    /**
     * ChildMixin node. This description is NOT used in the docs of GrandChild because description is specified in GrandChild.
     * @config {Object} _testMixinGrandChildDescription
     * @category Test
     * @private
     */

    /**
     * ChildMixin node. This description is USED in the docs of GrandChild because there is no description in GrandChild and mixin is more important than relatives.
     * @config {Object} _testMixinChildDescription
     * @category Test
     * @private
     */

    /**
     * ChildMixin node. This description is USED in the docs of GrandChild because there is no description in GrandChild and mixin is more important than relatives.
     * @config {Object} _testMixinBaseDescription
     * @category Test
     * @private
     */
}
