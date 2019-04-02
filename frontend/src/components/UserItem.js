import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { refreshToken } from '../utils/refreshToken';


class UserItem extends Component {
	constructor(props) {
		super(props);
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.getThread = this.getThread.bind(this);
	}

	async getThread() {
		const endpoint = `${this.API_URL}/api/chat/user/${this.props.user.pk}/`;
		let lookupOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`
			}
		}

		let response = await fetch(endpoint, lookupOptions);
		console.log(response);
		if (response.status === 401) {
			let refresh = await refreshToken();
			if (refresh) {
				this.getThread();
			} else {
				this.props.handleLogout();
			}
		} else if (response.status === 404) {
			let user1 = this.props.user.pk;
			let user2 = this.props.me;
			lookupOptions.method = 'POST';
			lookupOptions.body = {
				'user1_pk': { user1 },
				'user2_pk': { user2 }
			}
			response = await fetch(endpoint, lookupOptions);
		}

		let data = await response.json();
		this.props.history.push(`/chat/${data.pk}/`);

	}

	render() {
		const { user } = this.props;
		const API_URL = `${process.env.REACT_APP_API_URL}`;
		const userAvatar = `${API_URL}${user.get_avatar}`;
		return (
			<div>
				<div className='card-shadow user-card p-3 m-1' onClick={ this.getThread }>
					<p className='m-0'>
						<img className='avatar mr-3' src={ userAvatar } alt='avatar' />
						<strong className="user-item-username">{ user.username }</strong>
					</p>
				</div>
			</div>
		);
	}
}

export default withRouter(UserItem);

