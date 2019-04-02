const axios = require('axios');

export async function refreshToken() {
	const API_URL = `${process.env.REACT_APP_API_URL}`;
	const endpoint = `${API_URL}/api/token/refresh/`;

	try {
		let response = await axios.post(endpoint, {
			'refresh': localStorage.getItem('refreshToken')
		});

		let data = await response.data;
	  localStorage.setItem('accessToken', data.access);
	  return true;

	} catch (error) {
		console.log(error.response.data);
		if (error.response.data.code === 'token_not_valid') {
			// Log the user out
			console.log('logged out');
			return false;
		}
	}

}

