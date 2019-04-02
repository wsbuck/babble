import React, { Component } from 'react';
import { Route, Redirect, Switch, Link } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ThreadList from './components/ThreadList';
import MessageList from './components/MessageList';

import { Nav, Navbar } from 'react-bootstrap';

import { refreshToken } from './utils/refreshToken';

import './App.css';

function PrivateRoute(
	{ component: Component, loggedIn, handleLogout,
		user, ...rest }) {
	return (
		<Route
			{...rest}
			render={props =>
					loggedIn ? (
						<Component {...props} handleLogout={handleLogout} user={user} />
					) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: props.location }
							}}
						/>
					)
			}
		/>
	);
}

class App extends Component {
	constructor(props) {
		super(props);
		this.API_URL = `${process.env.REACT_APP_API_URL}`;
		this.state = {
			loggedIn: null,
			user: null
		}
		this.handleLoginChange = this.handleLoginChange.bind(this);
	}

	componentWillMount() {
		this.setState({
			loggedIn: localStorage.getItem('accessToken') ? true : false
		});
	}

	componentDidMount() {
		this.getUser();
	}

	async getUser() {
		const endpoint = `${this.API_URL}/api/user/`
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
				this.getUser();
			} else {
				this.handleLogout();
			}
		}

		this.setState({ user: data.pk });
	}

	handleLoginChange(data) {
		this.setState({
			loggedIn: data.status,
			user: data.user
		});
	}

	handleLogout() {
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('accessToken');
		this.setState({
			loggedIn: false,
			user: null
		});
	}

	render() {
		let {loggedIn} = this.state;
		//console.log(loggedIn);
		return (
			<div className="App">
				<Navbar 
					className='fixed-top justify-content-center' 
					bg="dark" 
					variant="dark"
				>
					<Navbar.Brand href="/">Babble</Navbar.Brand>
					<Nav className="mr-auto_">
						<Link to='/chat/' className='m-1 btn btn-primary'>Threads</Link>
					</Nav>
					<Nav className="ml-auto_">
						{
							(loggedIn)
								? (
									<button
										className='float-left m-1 btn btn-primary'
										onClick={ () => this.handleLogout() }
									>
										Log Out
									</button>
								)
								: (
									<div>
									<Link
										to='/login/'
										className='float-left m-1 btn btn-primary'
									>
										Log In
									</Link>
									<Link
										to='/signup/'
										className='float-left m-1 btn btn-primary'
									>
										Sign Up
									</Link>
								</div>
								)
						}
					</Nav>
				</Navbar>
				<div className='app-container'>
					<Switch>
						<Route
							exact path='/'
							component={ Home }
						/>
						<PrivateRoute
							exact path='/chat/'
							component={ThreadList}
							loggedIn={ this.state.loggedIn }
							handleLogout={ () => this.handleLogout() }
							user={ this.state.user }
						/>
						<PrivateRoute
							exact path='/chat/:id/'
							component={ MessageList }
							loggedIn={ this.state.loggedIn }
							user={ this.state.user }
							handleLogout={ () => this.handleLogout() }
						/>
						<Route
							path='/login/'
							render={ (props) => (
								<Login 
									{...props} 
									onLoginChange={ this.handleLoginChange } 
								/>)
							}
						/>
						<Route
							path='/signup/'
							render={ (props) => (
								<Signup 
									{...props} 
									onLoginChange={ this.handleLoginChange } 
								/>)
							}
						/>

					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
