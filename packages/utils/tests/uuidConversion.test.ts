import { uuidToId, idToUuid } from '../src';

it('Should output correctly for uuidToId function', () => {
	expect(uuidToId('dd721d8b-bf35-4036-bdcd-e9378e8b7e83')).toBe('dd721d8bbf354036bdcde9378e8b7e83');
});

it('Should output correctly for idToUuid function', () => {
	expect(idToUuid('dd721d8bbf354036bdcde9378e8b7e83')).toBe('dd721d8b-bf35-4036-bdcd-e9378e8b7e83');
});
