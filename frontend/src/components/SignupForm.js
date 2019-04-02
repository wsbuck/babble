import React from 'react';
import PropTypes from 'prop-types';


class SignupForm extends React.Component {
	state = {
		email: '',
		username: '',
		password1: '',
		password2: '',
	}

	handle_change = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState(prevState => {
			const newState = { ...prevState };
			newState[name] = value;
			return newState;
		});
	}

	handle_password2 = e => {
		this.handle_change(e);
		if (this.state.password1 === e.target.value) {
			e.target.setCustomValidity('');
		} else {
			e.target.setCustomValidity('passwords must match!');
		}
	}

	render() {
		return (
			<form onSubmit = {e => this.props.handleSignup(e, this.state)}>
				<div className="form-group">
					<input
						type="email"
						name="email"
						value={ this.state.email }
						onChange={ this.handle_change }
						className="form-control my-1"
						placeholder="Email"
						required
					/>
					<input
						type="text"
						name="username"
						value={ this.state.username }
						onChange={ this.handle_change }
						className="form-control my-1"
						placeholder="Username"
						required
					/>
					<input
						type="password"
						name="password1"
						value={ this.state.password1 }
						onChange={ this.handle_change }
						className="form-control my-1"
						placeholder="Password"
						title="Minimum of 6 characters with lower and upper case and a number"
						pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}' 
						required
					/>
					<input
						type="password"
						name="password2"
						value={ this.state.password2 }
						onChange={ this.handle_password2 }
						className="form-control my-1"
						placeholder="Password Confirmation"
						pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}' 
						required
					/>
				</div>
				<input className="btn btn-primary" type="submit" value="Submit" />
			</form>
		);
	}
}

export default SignupForm;

SignupForm.propTypes = {
	handleSignup: PropTypes.func.isRequired
};
