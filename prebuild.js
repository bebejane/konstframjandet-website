require("dotenv").config({ path: "./.env" });
const fs = require("fs");
const { buildClient } = require("@datocms/cma-client-node");

(async () => {
	const client = buildClient({ apiToken: process.env.GRAPHQL_API_TOKEN });

	const districts = await client.items.list({
		filter: { type: "district" },
		order_by: "name_ASC",
	});

	fs.writeFileSync("./lib/districts.json", JSON.stringify(districts, null, 2));
	console.log(`generated districts.json (${districts.length})`);
})();
