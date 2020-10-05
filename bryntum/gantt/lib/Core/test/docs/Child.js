/**
 * @module Core/test/docs/Child
 */

import TestDocsBase from './TestDocsBase.js';
import ChildMixin from './ChildMixin.js';
import { base } from '../../helper/MixinHelper.js';

/**
 * Child of TestDocsBase.
 * This class is required to check how docs are generated.
 *
 * @internal
 * @mixes Core/test/docs/ChildMixin
 * @extends Core/test/docs/TestDocsBase
 */
export default class Child extends base(TestDocsBase).mixes(ChildMixin) {
    /**
     * Child node. This description is NOT used in the docs of GrandChild because description is specified in GrandChild.
     * @config {Object} _testGrandChildDescription
     * @category Test
     * @private
     */

    /**
     * Child node. This description is USED in the docs of GrandChild because there is no description in GrandChild and ChildMixin, and Child is the closest relative.
     * @config {Object} _testChildDescription
     * @category Test
     * @private
     */

    // _testBaseDescription should be taken from TestDocsBase.js

    /**
     * Child node. This description is NOT used in the docs of GrandChild because description is specified in GrandChild.
     * @config {Object} _testMixinGrandChildDescription
     * @category Test
     * @private
     */

    /**
     * Child node. This description is NOT used in the docs of GrandChild because description is specified in ChildMixin and there is no description in GrandChild.
     * @config {Object} _testMixinChildDescription
     * @category Test
     * @private
     */

    // _testMixinBaseDescription should be taken from ChildMixin.js
}
