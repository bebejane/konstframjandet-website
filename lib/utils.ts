import { apiQuery, TypedDocumentNode } from 'next-dato-utils/api';
import { sleep } from 'next-dato-utils/utils';
import { AllDistrictsDocument, DistrictBySubdomainDocument } from '@/graphql';
import * as EmailValidator from 'email-validator';
import { ReactNode } from 'react';
import { PRIMARY_SUBDOMAIN } from '@/lib/tenancy';

export const breakpoints = {
	mobile: 320,
	tablet: 740,
	desktop: 980,
	wide: 1900,
	navBreak: 1100,
};

export const pageSize = 50;

export const chunkArray = (array: any[] | ReactNode[], chunkSize: number) => {
	const newArr = [];
	for (let i = 0; i < array.length; i += chunkSize) newArr.push(array.slice(i, i + chunkSize));
	return newArr;
};

export const parseDatoError = (err: any) => {
	const apiError = err.response?.body?.data;
	if (!apiError) return err?.message ?? err;

	const error = {
		_error: apiError,
		message: apiError.map(({ attributes: { details } }: any) => {
			const { messages } = details;
			const m = !messages
				? undefined
				: (!Array.isArray(messages) ? [messages] : messages).join('. ');
			const d = (!Array.isArray(details) ? [details] : details)?.map(
				({ field_label, field_type, code, extraneous_attributes }) =>
					extraneous_attributes
						? `Error fields: ${extraneous_attributes.join(', ')}`
						: `${field_label} (${field_type}): ${code}`,
			);
			return `${m ?? ''} ${d ?? ''}`;
		}),
		codes: apiError.map(({ attributes: { code } }: any) => code),
	};
	return error;
};

export const pingEndpoint = async (path: string | string[], method: 'GET' | 'POST' = 'POST') => {
	path = !Array.isArray(path) ? [path] : path;
	path.forEach((p) =>
		fetch(p, { method, body: JSON.stringify({ ping: true }) })
			.then(() => console.log(`pinged ${path} endpoint`))
			.catch((err) => console.error(`Failed: ping ${path} endpoint`, err)),
	);
};

export const recordToSlug = (record: any): string => {
	let href;

	if (!record) {
		throw new Error('recordToSlug: Record  is empty');
	}

	if (typeof record === 'string') return record;
	else {
		const { __typename, slug, _allReferencingProjects, url } = record;
		switch (__typename) {
			case 'AboutRecord':
				href = `/om/${slug}`;
				break;
			case 'NewsRecord':
				href = `/aktuellt/${slug}`;
				break;
			case 'ProjectRecord':
				href = `/projekt/${slug}`;
				break;
			case 'ProjectSubpageRecord':
				href = `/projekt/${_allReferencingProjects[0].slug}/${slug}`;
				break;
			case 'ExternalLinkRecord':
				href = url;
				break;
			default:
				throw Error(`${__typename} is unknown record slug!`);
		}
	}

	return href;
};

export const isEmail = (email: string): boolean => EmailValidator.validate(email);

export const truncateParagraph = (
	s: string,
	sentances: number = 1,
	ellipsis: boolean = true,
	minLength = 200,
): string => {
	if (!s || s.length < minLength) return s;

	let dotIndex = s
		.split('.')
		?.slice(0, sentances + 1)
		.join('.')
		.lastIndexOf('.');
	let qIndex = s
		.split('? ')
		?.slice(0, sentances + 1)
		.join('? ')
		.lastIndexOf('? ');
	const isQuestion = (qIndex !== -1 && qIndex < dotIndex) || (dotIndex === -1 && qIndex > -1);

	if (dotIndex === -1 && qIndex === -1) {
		dotIndex = minLength - 1;
		ellipsis = true;
	}

	let str = s.substring(0, isQuestion ? qIndex : dotIndex); //`${s.substring(0, minLength - 1)}${s.substring(minLength - 1).split('.').slice(0, sentances).join('. ')}`
	return `${str}${ellipsis ? '...' : isQuestion ? '?' : '.'}`;
};

export const isEmptyObject = (obj: any) =>
	Object.keys(obj).filter((k) => obj[k] !== undefined).length === 0;

export const randomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function allDistricts(excludeMain: boolean = false): Promise<DistrictRecord[]> {
	const { allDistricts } = await apiQuery(AllDistrictsDocument, { all: true });
	return allDistricts.filter(({ subdomain }) =>
		excludeMain ? subdomain !== PRIMARY_SUBDOMAIN : true,
	) as DistrictRecord[];
}

export async function mainDistrict(): Promise<DistrictRecord> {
	const { district } = await apiQuery(DistrictBySubdomainDocument, {
		variables: { subdomain: PRIMARY_SUBDOMAIN },
	});
	return district as DistrictRecord;
}

export function districtUrl(district?: DistrictRecord | string): string {
	const subdomain = typeof district === 'object' ? district.subdomain : district;
	return process.env.NODE_ENV === 'production'
		? `https://${subdomain === PRIMARY_SUBDOMAIN ? 'www' : subdomain}.konstframjandet.se`
		: `http://localhost:3000${subdomain !== PRIMARY_SUBDOMAIN ? `/${subdomain}` : ''}`;
}

export type TruncateOptions = {
	sentences: number;
	useEllipsis: boolean;
	minLength: number;
};

export const truncateText = (text: string, options: TruncateOptions): string => {
	let { sentences = 1, useEllipsis = false, minLength = 0 } = options;

	// Split the text into sentences
	const sentencesArr = text.match(/[^\.!\?]+[\.!\?]+/g);

	// If there aren't enough sentences, return the full text
	if (!sentencesArr || sentencesArr.length <= sentences) {
		return text;
	}

	// Create the truncated text by joining specified number of sentences
	let truncatedText = sentencesArr.slice(0, sentences).join(' ');

	// Cut off at ! and ? until minimum length is reached
	while (truncatedText.length < minLength && truncatedText.search(/[!?]/) > -1) {
		if (!sentencesArr[sentences]) break;
		truncatedText = truncatedText.concat(
			sentencesArr[sentences].match(/^[^!.?]+[!.?]+/)
				? sentencesArr[sentences].match(/^[^!.?]+[!.?]+/)[0]
				: '',
		);
		sentences++;
	}

	if (useEllipsis) {
		truncatedText += '...';
	}

	return truncatedText;
};

export const animateLogo = async (id) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	const logo = document.getElementById(id) as HTMLAnchorElement;
	for (let i = 0; i < alphabet.length; i++) {
		logo.innerText = alphabet[i];
		await sleep(20);
	}
	logo.innerText = alphabet[0];
};

export const truncateWords = (text: string, minLength: number): string => {
	if (text.length <= minLength) {
		return text;
	}
	var truncatedText = text.substring(0, minLength);
	var lastSpaceIndex = truncatedText.lastIndexOf(' ');
	if (lastSpaceIndex !== -1) {
		truncatedText = truncatedText.substr(0, lastSpaceIndex);
	}
	return truncatedText + '...';
};
