/**
 *- Fullscreen button.
 *
 * If container is passed in props then it
 * appends itself to that container. Otherwise it creates a
 * div and renders into that div.
 *
 * cSpell: ignore toggleable
 */
// libraries
import React, { Component } from 'react';
import { Fullscreen, WidgetHelper } from 'bryntum-gantt';

export default class FullscreenButton extends Component {

    /**
     * Configure and render Fullscreen button
     */
    componentDidMount() {

        const button = Fullscreen.enabled ? WidgetHelper.createWidget({
            type       : 'button',
            id         : 'fullscreen-button',
            icon       : 'b-icon b-icon-fullscreen',
            tooltip    : 'Fullscreen',
            toggleable : true,
            cls        : 'b-blue b-raised',
            onToggle   : ({ pressed }) => {
                if (pressed) {
                    Fullscreen.request(document.documentElement);
                }
                else {
                    Fullscreen.exit();
                }
            }
        }) : null; // eo function button

        if (button) {
            Fullscreen.onFullscreenChange(() => {
                this.button.pressed = Fullscreen.isFullscreen;
            });

            button.appendTo = this.props.container || this.el;
            if (!this.props.skipRender) {
                button.render();
            }

            this.button = button;
        }

    } // eo function componentDidMount

    /**
     * Cleanup
     */
    componentWillUnmount() {
        if (this.button) {
            Fullscreen.onFullscreenChange(null);
        }
    } // eo function componentWillUnmount

    render() {
        return this.props.container ? null : <div ref={el => this.el = el}></div>;
    }
} // eo class FullscreenButton

// eof
