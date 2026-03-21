import { sleep } from 'next-dato-utils/utils';
import * as EmailValidator from 'email-validator';

export const isEmail = (email: string): boolean => EmailValidator.validate(email);

export const isEmptyObject = (obj: any) =>
	Object.keys(obj).filter((k) => obj[k] !== undefined).length === 0;

export const animateLogo = async (id: string) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	const logo = document.getElementById(id) as HTMLAnchorElement;
	for (let i = 0; i < alphabet.length; i++) {
		logo.innerText = alphabet[i];
		await sleep(20);
	}
	logo.innerText = alphabet[0];
};
