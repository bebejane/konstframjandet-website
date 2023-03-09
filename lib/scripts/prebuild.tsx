import fs from 'fs'
import * as dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

import { apiQuery } from 'dato-nextjs-utils/api';
import { AllDistricsDocument } from '../../graphql';

(async () => {
	const { districts } = await apiQuery(AllDistricsDocument, { apiToken: process.env.GRAPHQL_API_TOKEN })
	if (!districts.length) throw new Error("No districts found!");
	fs.writeFileSync("./lib/districts.json", JSON.stringify(districts, null, 2));
	console.log(`generated districts.json (${districts.length})`);
})();
