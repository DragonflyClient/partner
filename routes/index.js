var express = require('express');
var router = express.Router();
const axios = require('axios').default;

/* GET home page. */
router.get('/:partner?', async function (req, res, next) {
	const { partner } = req.params;
	let success;
	console.log(process.env.MASTER_PASSWORD.toString());
	try {
		const response = await axios.get(`https://api.playdragonfly.net/v1/partner/partners/name/${partner}`, {
			auth: {
				username: 'master',
				password: process.env.MASTER_PASSWORD.toString()
			}
		});
		success = response.data.success;
	} catch (error) {
		success = error.response.data.success;
	}
	console.log(success);
	if (success) {
		res.cookie('partner', partner).redirect(`https://playdragonfly.net/?utm_source=partner&utm_medium=partner&utm_campaign=${partner}`);
	} else {
		res.redirect('https://playdragonfly.net/');
	}
});

module.exports = router;
