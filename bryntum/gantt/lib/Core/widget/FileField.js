import Field from './Field.js';
import TemplateHelper from '../helper/TemplateHelper.js';
import BryntumWidgetAdapterRegister from '../adapter/widget/util/BryntumWidgetAdapterRegister.js';

/**
 * @module Core/widget/FileField
 */

/**
 * Filefield widget. Wraps native &lt;input type="file"&gt;.
 *
 * There is a nicer styled wrapper for this field, see {@link Core/widget/FilePicker}
 *
 * @extends Core/widget/Field
 * @example
 *
 * let fileField = new FileField({
 *   multiple : true,
 *   accept   : "image/*"
 * });
 *
 * @classType filefield
 * @externalexample widget/FileField.js
 */
export default class FileField extends Field {
    static get $name() {
        return 'FileField';
    }

    internalOnChange(event) {
        // Event order is not consistent across browsers:
        //
        //  Chrome/Firefox:             IE11:                       Edge:
        //      internalOnInput             internalOnChange            internalOnChange
        //      internalOnChange            internalOnInput
        //
        // The problem this creates is that the onChange logic expects value != lastValue which is ensured by the
        // onInput handler. In the IE11/Edge sequence, the first change event is ignored, but with a file input that
        // is the only one you get and so the component's change event does not fire. The user has to make a second
        // file selection to get the event to fire.
        //
        // Fortunately, the event sequence for a file input is simple, so we can just force that order here:
        super.internalOnInput(event);
        super.internalOnChange(event);
    }

    internalOnInput() {
        // ignore -- see internalOnChange above
    }

    static get defaultConfig() {
        return {
            /**
             * Set to true to allow picking multiple files
             * @config {Boolean}
             * @default
             */
            multiple : false,

            /**
             * Comma-separated list of file extensions or MIME type to to accept. E.g.
             * ".jpg,.png,.doc" or "image/*". Null by default, allowing all files.
             * @config {String}
             */
            accept : null
        };
    }

    inputTemplate() {
        const me = this;

        // Historical note: this had a comment about not setting "reference" and how removing it helped IE11:
        //
        //  > [8/13/2019]
        //  > Not using reference="input" here intentionally.
        //  > In IE11/Edge when you pick file first time, field.value reports empty string while field.files.length is
        //  > non zero. Trying to fix this and embed file field to common field behavior is very tricky because cannot
        //  > be covered with siesta tests (it looks like).
        //
        // It is true that you cannot test a file input using synthetic events (as in Siesta), but the root of the IE11
        // value issue comes down to event order. See comments in internalOnChange above. At one time that might have
        // worked by inserting a timing change, however, the "reference" was added back on 11/22/2019 to resolve issues
        // related to incorrect attachment of the input element.
        return TemplateHelper.tpl`
            <input
             type="file"
             reference="input"
             id="${me.id}_input"
             class="${me.inputCls || ''}"
             ${me.multiple ? 'multiple' : ''}
             ${me.accept ? 'accept="' + me.accept + '"' : ''}
            />
        `;
    }

    /**
     * Returns list of selected files
     * @returns {FileList}
     * @readonly
     */
    get files() {
        return this.input.files;
    }

    /**
     * Opens browser file picker
     * @internal
     */
    pickFile() {
        this.input.click();
    }

    /**
     * Clears field value
     */
    clear() {
        this.input.value = null;
    }

    triggerChange(event) {
        this.trigger('change', {
            event,
            value      : this.input.value,
            oldValue   : this._lastValue,
            userAction : true,
            valid      : true
        });
    }
}

BryntumWidgetAdapterRegister.register('filefield', FileField);
