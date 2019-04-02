import React, { Component } from 'react';

import Message from './Message';
import Input from './Input';

import MyLoader from './MyLoader';

import Loader from 'react-loader-spinner';

import { refreshToken } from '../utils/refreshToken';


class MessageList extends Component {
	constructor(props) {
		super(props);
		this.API_HOST = `${process.env.REACT_APP_API_HOST}`;
		this.state = {
			messages: [],
			doneLoading: false,
		}
	}

	componentDidMount() {
		if (this.props.match) {
			const {id} = this.props.match.params;
			this.setState({
				thread_id: id,
			});
			this.loadMessages(id);
		}
	}


	async loadMessages(id) {
		const endpoint = `${this.API_HOST}/api/chat/${id}/`;
		let lookupOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`
			}
		}

		let response = await fetch(endpoint, lookupOptions);
		let data = await response.json();

		if (data.code === 'token_not_valid') {
			let refresh = await refreshToken();
			if (refresh) {
				this.loadMessages(id);
			} else {
				this.props.handleLogout();
			}
		}

		this.setState({
			messages: data,
			doneLoading: true
		});

	}

	render() {
		const { messages } = this.state;
		const { doneLoading } = this.state;

		return (
			<div className='container chat-holder' id='chat-holder'>
				{
					(doneLoading)
						? (
							(messages.length > 0)
							? (
								messages.map(message => {
									let msgClass = (message.user === this.props.user)
										? "speech-bubble-sent"
										: "speech-bubble-received";
									return (
										<Message
											key={ message.id }
											message={ message }
											elClass={ msgClass }
										/>
									)
								})
							)
							: <p>No Messages are found</p>
						) : (
							<MyLoader />
						)
				}
			</div>
		);
	}
}

export default MessageList;
