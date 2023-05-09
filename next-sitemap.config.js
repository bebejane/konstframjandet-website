module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL, //TODO: how to do this with subdomains
	generateRobotsTxt: true,
	exclude: ["/api"],
};
