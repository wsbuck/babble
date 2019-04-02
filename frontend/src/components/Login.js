import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import LoginForm from './LoginForm';

const API_URL = `${process.env.REACT_APP_API_URL}`;

class Login extends Component {
	constructor(props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.state = {
			displayed_form: '',
			redirectToReferrer: false
		}

	}

	handleLogin(e, data) {
		e.preventDefault();
		fetch(`${API_URL}/api/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(json => {
				localStorage.setItem('refreshToken', json.refresh);
				localStorage.setItem('accessToken', json.access)
				if (json.access) {
					data = {
						'status': true,
						'user': json.user,
					}
					this.props.onLoginChange(data);
					this.setState({ redirectToReferrer: true });
				}
			});
	}
	

	handle_login = (e, data) => {
		e.preventDefault();
		fetch(`${API_URL}/api/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(json => {
				localStorage.setItem('refreshToken', json.refresh);
				localStorage.setItem('accessToken', json.access)
				if (json.access) {
					this.props.onLoginChange(true);
					this.setState({ redirectToReferrer: true });
				}
			});
	};

	render() {
		let { from } = this.props.location.state || { from: { pathname: "/" } };
		let { redirectToReferrer } = this.state;

		if (redirectToReferrer) return <Redirect to={from} />;

		return (
			<div className="container card-shadow">
				<p>Please login to continue</p>
				<LoginForm handle_login={this.handleLogin} />
			</div>
		);
	}
}

export default Login;
