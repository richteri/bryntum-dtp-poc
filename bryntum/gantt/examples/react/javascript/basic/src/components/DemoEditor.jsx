// /* eslint-disable */
import React from 'react';

// Defines a simple React cell editor that displays two buttons Yes|No, for editing boolean columns
export default class DemoEditor extends React.Component {
    state = {
        value : ''
    };

    //region Cell editing interface, required functions

    // Should return the value to be applied when editing finishes
    getValue() {
        return this.state.value;
    }

    // Current cell value + context, set when editing starts. Use it to populate your editor
    setValue(value, cellEditorContext) {
        this.setState({ value });
    }

    // Invalid editors are note allowed to close (unless grid is so configured). Implement this function to handle
    // validation of your editor
    isValid() {
        // This simple editor is always valid
        return true;
    }

    // Called when editing starts, to set focus at the desired place in your editor
    focus() {
        if (this.state.value) {
            this.noButton.focus();
        }
        else {
            this.yesButton.focus();
        }
    }

    //endregion

    onYesClick() {
        this.setValue(true);
        this.noButton.focus();
    }

    onNoClick() {
        this.setValue(false);
        this.yesButton.focus();
    }

    render() {
        return <React.Fragment>
            <button className="yes-button" tabIndex={-1} ref={el => this.yesButton = el} style={{ background: this.state.value ? '#D5F5E3' : '#F2F3F4' }} onClick={this.onYesClick.bind(this)}>Yes</button>
            <button className="no-button" tabIndex={-1} ref={el => this.noButton = el} style={{ background: this.state.value ? '#F2F3F4' : '#F5B7B1' }} onClick={this.onNoClick.bind(this)}>No</button>
            </React.Fragment>;
    }
}
