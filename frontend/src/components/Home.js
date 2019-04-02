import React, {Component} from 'react';

class Home extends Component {
	constructor(props) {
		super(props);
		this.API_HOST = `${process.env.REACT_APP_API_HOST}`;
	  this.state = {
		}
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<h3>Hello! This is the home page!</h3>
			</div>
		);
	}
}

export default Home;
