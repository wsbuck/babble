import React from 'react';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
	state = {
		email: '',
		password: ''
	};

	handle_change = e => {
		const name = e.target.name;
		const value = e.target.value;
		this.setState(prevstate => {
			const newState = { ...prevstate };
			newState[name] = value;
			return newState;
		});
	};

	render() {
		return (
			<form onSubmit = {e => this.props.handle_login(e, this.state)}>
				<div className="form-group">
				  <input
				  	type="text"
				  	name="email"
				  	value={this.state.email}
						onChange={this.handle_change}
						className="form-control my-1"
						placeholder="Email"
				  />
				  <input
				  	type="password"
				  	name="password"
				  	value={this.state.password}
						onChange={this.handle_change}
						className="form-control my-1"
						placeholder="Password"
					/>
				</div>
				<input className="btn btn-primary" type="submit" value="Submit" />
			</form>
		);
	}
}

export default LoginForm;

LoginForm.propTypes = {
	handle_login: PropTypes.func.isRequired
};
