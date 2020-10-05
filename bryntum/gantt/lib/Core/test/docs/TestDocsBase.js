/**
 * @module Core/test/docs/TestDocsBase
 */

import Base from '../../Base.js';

/**
 * Base class for subclassing.
 * This class is required to check how docs are generated.
 *
 * @internal
 * @abstract
 * @extends Core/Base
 */
export default class TestDocsBase extends Base {
    /**
     * TestDocsBase node. This description is NOT used in the docs of GrandChild because description is specified in GrandChild.
     * @config {Object} _testGrandChildDescription
     * @category Test
     * @private
     */

    /**
     * TestDocsBase node. This description is NOT used in the docs of GrandChild because description is specified in Child and there is no description in GrandChild and ChildMixin.
     * @config {Object} _testChildDescription
     * @category Test
     * @private
     */

    /**
     * TestDocsBase node. This description is USED in the docs of GrandChild because there is no description in Child, GrandChild and ChildMixin.
     * @config {Object} _testBaseDescription
     * @category Test
     * @private
     */

    /**
     * TestDocsBase node. This description is NOT used in the docs of GrandChild because description is specified in GrandChild.
     * @config {Object} _testMixinGrandChildDescription
     * @category Test
     * @private
     */

    /**
     * TestDocsBase node. This description is NOT used in the docs of GrandChild because description is specified in ChildMixin and there is no description in GrandChild.
     * @config {Object} _testMixinChildDescription
     * @category Test
     * @private
     */

    /**
     * TestDocsBase node. This description is NOT used in the docs of GrandChild because description is specified in ChildMixin and there is no description in Child and GrandChild.
     * @config {Object} _testMixinBaseDescription
     * @category Test
     * @private
     */
}
