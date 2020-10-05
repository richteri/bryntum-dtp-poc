import React from 'react';

// Defines a simple button React component
export default class DemoButton extends React.Component {
    render() {
        return <button className="b-button b-green" onClick={this.props.onClick} style={{ width : '100%' }}>{this.props.text}</button>
    }
}
