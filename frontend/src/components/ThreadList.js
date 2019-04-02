import React, { Component } from 'react';

import Thread from './Thread';
import MyLoader from './MyLoader';
import UserModal from './UserModal';

import { refreshToken } from '../utils/refreshToken';


class ThreadList extends Component {
	constructor(props) {
		super(props);
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.state = {
			threads: [],
			doneLoading: false,
		}
	}

	componentDidMount() {
		this.loadThreads();
	}

	async loadThreads() {
		const endpoint = `${this.API_URL}/api/chat/`;
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
				this.loadThreads();
			} else {
				this.props.handleLogout();
			}
		}

		this.setState({
			threads: data,
			doneLoading: true
		});
	}

	render() {
		const { doneLoading } = this.state;
		const { threads } = this.state;
		return (
			<div className='mt-4'>
				{
					(doneLoading)
						? (
							(threads.length > 0)
							? threads.map(thread => {
								return (
									<Thread
										key={ thread.pk }
										thread={ thread }
									/>
								)
							})
							: <p>No Threads are found</p>
						)
						: (
							<MyLoader />
						)
				}
				<div className="m-4">
					<UserModal user={this.props.user} handleLogout={this.props.handleLogout} />
				</div>
			</div>
		);
	}
}

export default ThreadList;
