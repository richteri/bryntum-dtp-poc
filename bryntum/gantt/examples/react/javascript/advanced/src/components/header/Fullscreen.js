/**
 * Fullscreen button. If container is passed in props then it
 * appends itself to that container. Otherwise it creates a
 * div and renders into that div.
 */
// libraries
import React, { useRef, useEffect } from 'react';
import { Fullscreen, WidgetHelper } from 'bryntum-gantt';

const button = props => {

    // refs and t function
    const
        elRef = useRef(),
        buttonRef = useRef();

    // Bryntum button instance
    const button = buttonRef.current = buttonRef.current || (Fullscreen.enabled ? WidgetHelper.createWidget({
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
    }) : null);

    // runs once on mounting – initialization
    useEffect(() => {
        if (button) {
            Fullscreen.onFullscreenChange(() => {
                button.pressed = Fullscreen.isFullscreen;
            });

            button.appendTo = props.container || elRef.current;
            if (!props.skipRender) {
                button.render();
            }
        }

        return () => {
            if (button) {
                Fullscreen.onFullscreenChange(null);
            }
        };

    }, []);

    // container for the button
    return props.container ? null : <div ref={elRef}></div>;

}; // eo function button

// connects to Redux and exports the button
export default button;

// eof
