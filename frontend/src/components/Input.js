import React, { Component } from  'react';

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: '',
		}
	}

	onChange(e) {
		this.setState({content: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({content: ""});
		this.props.onSendMessage(this.state.content);
	}

	render() {
		return (
			<div className="chat-input-container px-2">
				<form className="form-inline" onSubmit={e => this.onSubmit(e)}>
					<div className="input-group mb-3">
						<input
							onChange={e => this.onChange(e)}
							value={this.state.content}
							type="text"
							placeholder="Enter your message"
							autoFocus={true}
							className="form-control"
							autoComplete="off"
						/>
						<div className="input-group-append">
							<button className="btn btn-outline-secondary">Send</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default Input;
