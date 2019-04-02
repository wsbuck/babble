import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class Thread extends Component {
	render() {
		const { thread } = this.props;
		const API_URL = `${process.env.REACT_APP_API_URL}`;
		const avatarURL = `${API_URL}/media/${thread.receiver_avatar}`
		const threadURL = `/chat/${thread.pk}/`;
		return (
			<div>
				<Link to={ threadURL } style={{ textDecoration: 'none' }}>
					<div className='card-shadow my-1 user-card'>
						<p className='mb-1'>
							<img className='avatar' src={ avatarURL } alt='avatar' />
							<strong>{ thread.receiver_username }</strong>
						</p>
						<p><small>{ new Date(thread.last_updated).toLocaleString() }</small></p>
					</div>
				</Link>
			</div>
		);
	}
}

export default Thread;
