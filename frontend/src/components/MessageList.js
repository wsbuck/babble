import React, { Component } from 'react';

import Message from './Message';
import Input from './Input';

import MyLoader from './MyLoader';

import { refreshToken } from '../utils/refreshToken';

import ReconnectingWebSocket from 'reconnecting-websocket';


class MessageList extends Component {
	constructor(props) {
		super(props);
		this.API_HOST = `${process.env.REACT_APP_API_HOST}`;
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.onSendMessage = this.onSendMessage.bind(this);
		this.initSocket = this.initSocket.bind(this);
		//this.componentWillUnmount = this.componentWillUnmount.bind(this);
		
		this.state = {
			messages: [],
			doneLoading: false,
			socket: null,
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

		let path = window.location.pathname
		let wsStart = 'ws://';
		let tokenParam = `?token=${localStorage.getItem('accessToken')}`;
		let endpoint = wsStart + this.API_HOST + path + tokenParam;
		this.initSocket(endpoint);
		//var socket = new ReconnectingWebSocket(endpoint);
		this.scrollBottom();
	}

	componentWillUnmount() {
		let { socket } = this.state;
		console.log('about to close socket');
		socket.close();
	}

	componentDidUpdate() {
		this.scrollBottom();
	}

	onSendMessage(msg) {
		let finalData = {
			'message': msg
		}
		//console.log(this);
		let { socket } = this.state;
		socket.send(JSON.stringify(finalData));
	}


	async loadMessages(id) {
		const endpoint = `${this.API_URL}/api/chat/${id}/`;
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
		});

	}

	scrollBottom() {
		this.inputContainer.scrollIntoView({ behavior: 'smooth' });
	}

	initSocket(endpoint) {
		const socket = new ReconnectingWebSocket(endpoint);

		socket.onopen = (e) => {
			console.log('open', e);
			this.setState({
				doneLoading: true
			});
		}

		socket.onerror = (e) => {
			console.log('error', e);
		}

		socket.onclose = (e) => {
			console.log('close', e);
			this.setState({
				doneLoading: false
			});
			
		}

    socket.onmessage = (e) => {
			let messageData = JSON.parse(e.data);
			let { messages } = this.state;
		  messages.push(messageData);
		  this.setState({
		  	messages: messages
			});

			this.scrollBottom();
		}

		this.setState({'socket': socket});

	}

	render() {
		const { messages } = this.state;
		const { doneLoading } = this.state;
		const { user } = this.props;

		return (
			<div className='container chat-holder card-shadow' id='chat-holder'>
				{
					(doneLoading)
						? (
							(messages.length > 0)
							? messages.map((message_item) => {
								let msgClass = (message_item.user === user)
									? "speech-bubble-sent"
									: "speech-bubble-received"
								return (
									<Message
										key={ message_item.pk }
										message={ message_item }
										elClass={ msgClass }
									/>
								)
							})
							: <p>No Messages yet</p>
						)
						: (
							<MyLoader />
						)
				}
				<div 
					className="chat-input-container" 
					ref={(el) => { this.inputContainer = el; }}>
					<Input onSendMessage={ this.onSendMessage } />
				</div>
			</div>
		);

	}
}

export default MessageList;
