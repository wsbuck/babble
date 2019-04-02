import React, { Component } from 'react';

class Message extends Component {

	render() {
		const { message } = this.props;
		const url = `${process.env.REACT_APP_API_URL}`;
		return (
			<div className={ this.props.elClass }>
				<p className="message-content">{ message.message }</p>
				<p className="message-timestamp">
					{ new Date(message.timestamp).toLocaleString() }
				</p>
				<div className="avatar-message">
					<img src={ url + message.get_avatar } alt="avatar" />
				</div>
			</div>
		);
	}
}

export default Message;
