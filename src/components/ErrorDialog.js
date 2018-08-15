import React, { Component } from 'react';

class ErrorDialog extends Component {
	constructor() {
		super();
		this.state = {
			errIndex: 0,
			message: ''
		};
	}

	componentDidUpdate(prevProps, prevState) {
		// If an error has been passed increase the error index.
		if (prevProps.errorMsg !== this.props.errorMsg) {
			if (this.props.errorMsg)
				this.setState(state => ({ errIndex: state.errIndex + 1, message: this.props.errorMsg }));
		}
		// If an error occured clear the error after 5s.
		if (prevState.errIndex !== this.state.errIndex) {
			setTimeout(() => {
				this.props.clearError();

				// If there are still errors to show increase the error index.
				if (this.props.errorMsg)
					this.setState(state => ({ errIndex: state.errIndex + 1, message: this.props.errorMsg }));
			}, 4100);
			setTimeout(() => this.setState({ message: '' }), 4000); // Set a small intervall to clear the message so that the screen reader can call the new message.
		}
	}

	render() {
		const { message } = this.state;
		return (
			<div
				className={message ? 'error_dialog open' : 'error_dialog'}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				style={message ? {display: 'block'} : {display: ''}}
				>
				<span>{message}</span>
			</div>
		);		
	}
};

export default ErrorDialog;
