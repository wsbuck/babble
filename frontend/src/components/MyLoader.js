import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

class MyLoader extends Component {
	render() {
		return (
			<div className='loader-container'>
				<Loader
					type="Puff"
					color="#00BFFF"
					height="50"
					width="50"
				/>
			</div>
		);
	}
}

export default MyLoader;
