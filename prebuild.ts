import 'dotenv/config';
import fs from 'fs';
import { AllDistrictsDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';

(async () => {
	const { allDistricts } = await apiQuery(AllDistrictsDocument);
	fs.writeFileSync('./districts.json', JSON.stringify(allDistricts, null, 2));
})();
