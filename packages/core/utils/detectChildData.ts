import { TDataType, TBlock } from '@nishans/types';

export const detectChildData = (type: TDataType, data: TBlock) => {
	let child_type: TDataType = 'block',
		child_path = '';
	if (type === 'block') {
		if (data.type === 'page') child_path = 'content';
		else if (data.type === 'collection_view' || data.type === 'collection_view_page') {
			child_path = 'view_ids';
			child_type = 'collection_view';
		}
	} else if (type === 'space') child_path = 'pages';
	else if (type === 'user_root') {
		child_path = 'space_views';
		child_type = 'space_view';
	} else if (type === 'collection') child_path = 'template_pages';
	else if (type === 'space_view') child_path = 'bookmarked_pages';

	return [ child_path, child_type ] as [string, TDataType];
};
