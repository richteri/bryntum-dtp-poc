/**
 *- React Widget wrapper
 */
import React, { Component } from 'react';
import { WidgetHelper, ObjectHelper } from 'bryntum-gantt';

class BryntumWidget extends Component {

    // defaults for the widget. Feel free to adjust it
    static defaultProps = {
    };

    /* #region configs */
    // this is only a subset of all possible widget properties of all types
    configs = [
        'activeTab',
        'allowOver',
        'anchorToTarget',
        'animateTabChange',
        'autoClose',
        'autoComplete',
        'autoExpand',
        'autoShow',
        'badge',
        'bbar',
        'checked',
        'chipView',
        'clearable',
        'clearHandler',
        'closable',
        'closeAction',
        'closeParent',
        'cls',
        'color',
        'dataset',
        'defaults',
        'disabled',
        'displayField',
        'displayValueRenderer',
        'editable',
        'emptyText',
        'filterOperator',
        'filterSelected',
        'flex',
        'focusOnHover',
        'footer',
        'forElement',
        'forSelector',
        'format',
        'header',
        'height',
        'hidden',
        'hideDelay',
        'highlightExternalChange',
        'html',
        'icon',
        'iconTpl',
        'inline',
        'inputWidth',
        'itemCls',
        'items',
        'keyStrokeChangeDelay',
        'keyStrokeFilterDelay',
        'label',
        'labelWidth',
        'layoutStyle',
        'listCls',
        'listeners',
        'listItemCls',
        'loadingMsg',
        'margin',
        'max',
        'menu',
        'min',
        'minChars',
        'mode',
        'mouseOffsetX',
        'mouseOffsetY',
        'multiSelect',
        'onAction',
        'onChange',
        'onClick',
        'onItem',
        'picker',
        'pickerAlignElement',
        'pickerFormat',
        'pickerWidth',
        'placeholder',
        'pressed',
        'pressedIcon',
        'readOnly',
        'required',
        'resize',
        'ripple',
        'selected',
        'showOnClick',
        'showOnHover',
        'showProgress',
        'showTooltip',
        'showValue',
        'step',
        'store',
        'style',
        'tabMinWidth',
        'tabMaxWidth',
        'tbar',
        'text',
        'timeout',
        'title',
        'toggle',
        'toggleable',
        'toggleGroup',
        'tools',
        'tooltip',
        'trapFocus',
        'triggerAction',
        'triggers',
        'type',
        'unit',
        'useAbbreviation',
        'validateFilter',
        'value',
        'valueField',
        'visible',
        'width'
    ];
    /* #endregion */

    /* #region skipUpdateProps */
    // this is only a subset of props that should not be updated
    skipUpdateProps = [
        'clearable',
        'listeners',
        'placeholder',
        'triggers',
        'type'
    ];
    /* #endregion */

    // runs when React rendered DOM so we render the widget into that dom
    componentDidMount() {
        const config = {
            // we cannot use adopt because widgets can have different tags
            // e.g. button is <button></button>, adopt does not change tag
            appendTo : this.props.container || this.el
        }

        this.configs.forEach(configName => {
            if(undefined !== this.props[configName])
            config[configName] = this.props[configName];
        });

        // we must use adopt for splitter to prevent it from being wrapped
        if(config.type === 'splitter' && !this.props.container) {
            delete config.appendTo;
            config.adopt = this.el;
        }

        this.widget = WidgetHelper.createWidget(config);
        
        if(config.adopt) {
            // this triggers the setter - important for splitter
            this.widget.element = this.el;
        }

    } // eo function componentDidMount

    shouldComponentUpdate(nextProps, nextState) {
        const
            widget = this.widget,
            props = this.props,
            configs = this.configs,
            skipUpdateProps = this.skipUpdateProps
        ;
        Object.keys(props).forEach(propName => {
            // we update only changed props skipping the listed props
            if(configs.includes(propName) && !skipUpdateProps.includes(propName) && !ObjectHelper.isEqual(props[propName], nextProps[propName])) {
                widget[propName] = nextProps[propName];
            }
        });

        // we don't let React to re-render this component
        return false;
    } // eo function shouldComponentUpdate

    // let's destroy the underlying Bryntum widget
    componentWillUnmount() {
        this.widget && this.widget.destroy();
    } // eo function componentWillUnmount

    render() {
        return this.props.container ? null : <div ref={el => this.el = el}></div>;

    } // eo function render

} // eo class BryntumWidget

export default BryntumWidget;

// eof
