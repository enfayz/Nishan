import { TBlockType } from '@nishans/types';

export type FrontMatterKeys = 'title';

type NotionBlock<T extends TBlockType> = {
	title: string[][];
	type: T;
};

export interface HeaderNotionBlock extends NotionBlock<'header'> {}
export interface SubHeaderNotionBlock extends NotionBlock<'sub_header'> {}
export interface SubSubHeaderNotionBlock extends NotionBlock<'sub_sub_header'> {}
export interface TextNotionBlock extends NotionBlock<'text'> {}

export type TNotionBlocks = HeaderNotionBlock | SubHeaderNotionBlock | SubSubHeaderNotionBlock | TextNotionBlock;

export interface NotionOperationData {
	shard_id: number;
	space_id: string;
	user_id: string;
	headers: {
		headers: {
			cookie: string;
			'x-notion-active-user-header': string;
		};
	};
}

export type NotionMarkdownConfig = Record<FrontMatterKeys, any>;