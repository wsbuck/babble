import React, { Component } from 'react';

import { Modal, Button } from 'react-bootstrap';

import MyLoader from './MyLoader';
import UserItem from './UserItem';

import { refreshToken } from '../utils/refreshToken';


class UserModal extends Component {
	constructor(props) {
		super(props);
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.state = {
			show: false,
			users: [],
			doneLoading: false,
		};
	}

	componentDidMount() {
		this.loadUsers();
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	async loadUsers() {
		const endpoint = `${this.API_URL}/api/user/create/`;
		let lookupOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`
			}
		}

		let response = await fetch(endpoint, lookupOptions);
		if (response.status === 401) {
			let refresh = await refreshToken();
			if (refresh) {
				this.loadUsers();
			} else {
				this.props.handleLogout();
			}
		}

		let data = await response.json();
		this.setState({ 
			users: data,
			doneLoading: true
		});
	}


	render() {
		const { doneLoading } = this.state;
		const { users } = this.state;
		return (
			<div>
				{
					(doneLoading)
						? (
							<>
								<Button variant="primary" onClick={ this.handleShow }>
									Find User
								</Button>

								<Modal show={ this.state.show } onHide={ this.handleClose }>
									<Modal.Header closeButton>
										<Modal.Title>Users</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										{
											users.map(user => {
												return (
													<UserItem
														key={ user.pk }
														user={ user }
														me={ this.props.user }
													/>
												)
											})
										}
									</Modal.Body>
									<Modal.Footer>
										<Button variant="secondary" onClick={ this.handleClose }>
											Close
										</Button>
									</Modal.Footer>
								</Modal>
							</>
						)
						: (
							<MyLoader />
						)
				}
			</div>
		);
	}
}

export default UserModal;
