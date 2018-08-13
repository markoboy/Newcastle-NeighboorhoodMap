import React, { Component } from 'react';

class ErrorDialog extends Component {
	constructor() {
		super();
		this.state = {
			errIndex: 0
		};
	}

	componentDidUpdate(prevProps, prevState) {
		// If an error has been passed increase the error index.
		if (prevProps.errorMsg !== this.props.errorMsg) {
			if (this.props.errorMsg)
				this.setState(state => ({ errIndex: state.errIndex + 1 }));
		}
		// If an error occured clear the error after 5s.
		if (prevState.errIndex !== this.state.errIndex) {
			setTimeout(() => {
				this.props.clearError();

				// If there are still errors to show increase the error index.
				if (this.props.errorMsg)
					this.setState(state => ({ errIndex: state.errIndex + 1 }));
			}, 3000);
		}
	}

	render() {
		const { errorMsg } = this.props;
		return (
			<div
				className={errorMsg ? 'error_dialog open' : 'error_dialog'}
				role="alert"
				aria-live="assertive"
				aria-atomic="true"
				style={errorMsg ? {display: 'block'} : {display: ''}}
				>
				<span>{errorMsg}</span>
			</div>
		);		
	}
};

export default ErrorDialog;
