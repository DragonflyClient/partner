var express = require('express');
var router = express.Router();
const axios = require('axios').default;

/* GET home page. */
router.get('/:partner?/:site?', async function (req, res, next) {
	const { partner, site } = req.params;
	let redirectPage = 'https://playdragonfly.net/';
	const availableSites = [
		{
			key: 'register',
			site: 'https://playdragonfly.net/register'
		},
		{
			key: 'store',
			site: 'https://store.playdragonfly.net/'
		}
	];

	availableSites.map(availableSite => {
		if (site && availableSite.key === site.toLocaleLowerCase()) redirectPage = availableSite.site;
	});

	let success;
	try {
		const response = await axios.get(`https://api.playdragonfly.net/v1/partner/partners/name/${partner}`, {
			auth: {
				username: 'master',
				password: process.env.MASTER_PASSWORD
			}
		});
		success = response.data.success;
	} catch (error) {
		success = error.response.data.success;
	}

	if (success) {
		res.cookie('partner', partner, { domain: '.playdragonfly.net', secure: true, httpOnly: true, sameSite: 'lax' }).redirect(`${redirectPage}`);
	} else {
		res.redirect(`${redirectPage}?partner_error=not_found`);
	}
});

module.exports = router;
