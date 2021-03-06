import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';

import { LocalFileStructure } from '../src/types';
import { extractData } from './extractData';

export async function readFromFile (file_path: string) {
	const ext = path.extname(file_path);
	let data: LocalFileStructure = {} as any;
	if (ext === '.json') {
		data = JSON.parse(await fs.promises.readFile(file_path, 'utf-8'));
	} else if (ext === '.yaml' || ext === '.yml') {
		data = load(await fs.promises.readFile(file_path, 'utf-8')) as LocalFileStructure;
	} else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');

	return extractData(data as any);
}
