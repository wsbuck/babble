import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import SignupForm from './SignupForm';


class Signup extends Component {
	constructor(props) {
		super(props);
		this.handleSignup = this.handleSignup.bind(this);
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.state = {
			displayed_form: '',
			redirectToReferrer: false
		}
	}

	async handleSignup(e, data) {
		e.preventDefault();
		const endpoint = `${this.API_URL}/api/user/create/`;

		let body = {
			username: data.username,
			email: data.email,
			password: data.password1
		}

		let lookupOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}

		try {
			let response = await fetch(endpoint, lookupOptions);
			let json = await response.json();
			localStorage.setItem('refreshToken', json.tokens.refresh);
			localStorage.setItem('accessToken', json.tokens.access);
			if (json.tokens.access) {
				data = {
					'status': true,
					'user': json.pk
				}
				this.props.onLoginChange(data);
				this.setState({ redirectToReferrer: true });
			}

		} catch (error) {
			console.log(error);
		}

	}

	render() {
		let { from } = this.props.location.state || { from: { pathname: "/" } };
		let { redirectToReferrer } = this.state;

		if (redirectToReferrer) return <Redirect to={ from } />;

		return (
			<div className="container card-shadow">
				<p>Signup</p>
				<SignupForm handleSignup={ this.handleSignup } />
			</div>
		);
	}
}

export default Signup;
