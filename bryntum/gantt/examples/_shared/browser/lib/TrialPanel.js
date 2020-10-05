import BrowserHelper from '../../../../lib/Core/helper/BrowserHelper.js';
import Popup from '../../../../lib/Core/widget/Popup.js';
import DomHelper from '../../../../lib/Core/helper/DomHelper.js';
import Toast from '../../../../lib/Core/widget/Toast.js';
import BryntumWidgetAdapterRegister from '../../../../lib/Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';

export default class TrialPanel extends Popup {
    static get defaultConfig() {
        return {
            width    : 400,
            anchor   : true,
            title    : 'Please complete fields',
            defaults : {
                labelWidth : 100
            },
            items : [
                {
                    type     : 'textfield',
                    label    : 'Name <sup>*</sup>',
                    name     : 'name',
                    ref      : 'nameField',
                    required : true
                },
                {
                    type      : 'textfield',
                    inputType : 'email',
                    label     : 'Email <sup>*</sup>',
                    name      : 'email',
                    ref       : 'emailField',
                    required  : true
                },
                {
                    type     : 'textfield',
                    label    : 'Company <sup>*</sup>',
                    name     : 'company',
                    ref      : 'companyField',
                    required : true
                },
                {
                    type     : 'combo',
                    label    : 'Product',
                    editable : false,
                    ref      : 'productField',
                    name     : 'productId',
                    items    : [
                        { id : 'gantt', downloadId : 'gantt-vanilla', text : 'Bryntum Gantt' },
                        { id : 'grid', downloadId : 'grid', text : 'Bryntum Grid' },
                        { id : 'scheduler', downloadId : 'scheduler-vanilla', text : 'Bryntum Scheduler' }
                    ],
                    required : true
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    ref       : 'listNameField',
                    name      : 'listname'
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    ref       : 'trackingField',
                    name      : 'custom meta_adtracking'
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    ref       : 'redirectField',
                    name      : 'redirect'
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    name      : 'meta_message',
                    value     : '1'
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    name      : 'meta_required',
                    value     : 'name,email,custom company'
                },
                {
                    type      : 'textfield',
                    inputType : 'hidden',
                    name      : 'meta_forward_vars',
                    value     : '0'
                }
            ],

            bbar : [
                {
                    type : 'widget',
                    flex : 1
                },
                {
                    text    : 'Cancel',
                    width   : 100,
                    cls     : 'b-gray b-raised',
                    style   : 'margin-right:1em',
                    onClick : 'up.onCancelClick'
                },
                {
                    text    : 'Submit',
                    width   : 100,
                    cls     : 'b-blue b-raised',
                    onClick : 'up.onSubmitClick'
                }
            ]
        };
    }

    get bodyConfig() {
        return Object.assign(super.bodyConfig, {
            tag    : 'form',
            method : 'post',
            target : 'aweberFrame',
            action : 'https://www.aweber.com/scripts/addlead.pl'
        });
    }

    construct() {
        super.construct(...arguments);

        this.widgetMap.productField.value = this.productId;
    }

    onSubmitClick() {
        if (!this.isValid) {
            return;
        }

        this.addToMailList();

        this.triggerDownload();
    }

    addToMailList() {
        const
            {
                trackingField,
                redirectField,
                listNameField,
                companyField
            }             = this.widgetMap,
            { productId } = this.values;

        trackingField.value = BrowserHelper.getCookie('aw');
        redirectField.value = location.href;

        companyField.input.name = 'custom company';

        switch (productId) {
            case 'gantt':
                listNameField.value = 'awlist5314739';
                break;
            case 'scheduler':
                listNameField.value = 'awlist5074881';
                break;
            case 'grid':
                listNameField.value = 'awlist5074883';
                break;
        }

        this.bodyElement.submit();
    }

    onCancelClick() {
        this.hide();
    }

    triggerDownload() {
        const
            me                       = this,
            { name, email, company } = me.values;

        let productId = me.values.productId;

        switch (productId) {
            case 'gantt':
            case 'scheduler':
            case 'calendar':
                productId = `${productId}-vanilla`;
                break;
        }

        const a = DomHelper.createElement({
            parent   : document.body,
            tag      : 'a',
            download : `bryntum-${productId}-trial.zip`,
            href     : `/do_download.php?product_id=${productId}&thename=${name}&email=${email}&company=${company}`
        });

        DomHelper.createElement({
            parent : document.head,
            tag    : 'script',
            async  : 'true',
            src    : 'https://www.googletagmanager.com/gtag/js?id=UA-11046863-1',
            onload : me.trackDownload
        });

        a.click();

        a.parentElement.removeChild(a);

        me.hide();

        Toast.show({
            html    : 'Download starting, please wait...',
            timeout : 10000
        });

        if (!me.gaScript) {
            me.gaScript = DomHelper.createElement({
                parent : document.head,
                tag    : 'script',
                async  : 'true',
                src    : 'https://www.googletagmanager.com/gtag/js?id=UA-11046863-1',
                onload : me.trackDownload
            });
        }
    }

    // Google Analytics
    static trackDownload() {
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            window.dataLayer.push(arguments);
        }

        gtag('event', 'conversion', {
            send_to  : 'AW-1042491458/eweSCPibpAEQwtCM8QM',
            value    : 1.0,
            currency : 'USD'
        });
    }
};

BryntumWidgetAdapterRegister.register('trialpanel', TrialPanel);
