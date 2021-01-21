import { TFormatBlockColor } from '@nishans/types';

export class HighlightColors {
	text: [[string, string[][]]];

	constructor (text?: [[string, string[][]]]) {
		this.text = (text ?? []) as any;
	}

	get default () {
		this.text[this.text.length - 1][1].push([ 'h', 'default' ]);
		return new InlineBlockFormatter(this.text);
	}

	get gray () {
		this.text[this.text.length - 1][1].push([ 'h', 'gray' ]);
		return new InlineBlockFormatter(this.text);
	}

	get brown () {
		this.text[this.text.length - 1][1].push([ 'h', 'brown' ]);
		return new InlineBlockFormatter(this.text);
	}

	get orange () {
		this.text[this.text.length - 1][1].push([ 'h', 'orange' ]);
		return new InlineBlockFormatter(this.text);
	}

	get yellow () {
		this.text[this.text.length - 1][1].push([ 'h', 'yellow' ]);
		return new InlineBlockFormatter(this.text);
	}

	get teal () {
		this.text[this.text.length - 1][1].push([ 'h', 'teal' ]);
		return new InlineBlockFormatter(this.text);
	}

	get blue () {
		this.text[this.text.length - 1][1].push([ 'h', 'blue' ]);
		return new InlineBlockFormatter(this.text);
	}

	get purple () {
		this.text[this.text.length - 1][1].push([ 'h', 'purple' ]);
		return new InlineBlockFormatter(this.text);
	}

	get pink () {
		this.text[this.text.length - 1][1].push([ 'h', 'pink' ]);
		return new InlineBlockFormatter(this.text);
	}

	get red () {
		this.text[this.text.length - 1][1].push([ 'h', 'red' ]);
		return new InlineBlockFormatter(this.text);
	}

	get defaultbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'default_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get graybg () {
		this.text[this.text.length - 1][1].push([ 'h', 'gray_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get brownbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'brown_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get orangebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'orange_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get yellowbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'yellow_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get tealbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'teal_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get bluebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'blue_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get purplebg () {
		this.text[this.text.length - 1][1].push([ 'h', 'purple_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get pinkbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'pink_background' ]);
		return new InlineBlockFormatter(this.text);
	}

	get redbg () {
		this.text[this.text.length - 1][1].push([ 'h', 'red_background' ]);
		return new InlineBlockFormatter(this.text);
	}
}

export class InlineBlockFormatter extends HighlightColors {
	constructor (text?: [[string, string[][]]]) {
		super(text);
	}

	add (title: string) {
		this.text.push([ title, [] ]);
		return new InlineBlockFormatter(this.text);
	}

	get strikeThrough () {
		this.text[this.text.length - 1][1].push([ 's' ]);
		return new InlineBlockFormatter(this.text);
	}

	get code () {
		this.text[this.text.length - 1][1].push([ 'c' ]);
		return new InlineBlockFormatter(this.text);
	}

	get bold () {
		this.text[this.text.length - 1][1].push([ 'b' ]);
		return new InlineBlockFormatter(this.text);
	}

	get italic () {
		this.text[this.text.length - 1][1].push([ 'i' ]);
		return new InlineBlockFormatter(this.text);
	}

	get underline () {
		this.text[this.text.length - 1][1].push([ '_' ]);
		return new InlineBlockFormatter(this.text);
	}

	highlight (color: TFormatBlockColor) {
		this.text[this.text.length - 1][1].push([ 'h', color ]);
		return new InlineBlockFormatter(this.text);
	}

	linkTo (url: string) {
		this.text[this.text.length - 1][1].push([ 'a', url ]);
		return new InlineBlockFormatter(this.text);
	}
}

export function inlineText (title?: string) {
	return title ? new InlineBlockFormatter([ [ title, [] ] ]) : new InlineBlockFormatter();
}
