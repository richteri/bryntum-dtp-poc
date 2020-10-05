/**
 * @module Core/test/docs/GrandChild
 */

import Child from './Child.js';

/**
 * Child of Child of TestDocsBase.
 * This class is required to check how docs are generated.
 *
 * @internal
 * @extends Core/test/docs/Child
 */
export default class GrandChild extends Child {
    /**
     * GrandChild node. This description is USED in the docs of GrandChild.
     * @config {Object} _testGrandChildDescription
     * @category Test
     * @private
     */

    // _testChildDescription should be taken from Child.js

    // _testBaseDescription should be taken from TestDocsBase.js

    /**
     * GrandChild node. This description is USED in the docs of GrandChild.
     * @config {Object} _testMixinGrandChildDescription
     * @category Test
     * @private
     */

    // _testMixinChildDescription should be taken from ChildMixin.js

    // _testMixinBaseDescription should be taken from ChildMixin.js
}
