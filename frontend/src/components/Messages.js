import React, { Component } from 'react';

import MessageList from './MessageList';
import Input from './Input';

class Messages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			thread_id: null,
		}
	}

	componentDidMount() {
		if (this.props.match) {
			const {id} = this.props.match.params;
			this.setState({
				thread_id: id,
			});
		}
	}

	render() {
		let { thread_id } = this.state;
		return (
			<div>
				<MessageList
					user={ 2 }
					id={ thread_id }
				/>
				<Input />
			</div>
		);
	}
}

export default Messages;
