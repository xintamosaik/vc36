import type { TextSegment } from '#lib/types/cv.js';

export function parseFatText(text: string): TextSegment[] {
	const segments: TextSegment[] = [];
	const pattern = /##([\s\S]*?)##/g;
	let cursor = 0;

	for (const match of text.matchAll(pattern)) {
		const index = match.index;
		if (index > cursor) segments.push(text.slice(cursor, index));
		segments.push({ text: match[1], strong: true });
		cursor = index + match[0].length;
	}

	if (cursor < text.length) segments.push(text.slice(cursor));
	return segments;
}

export function stringifyFatText(segments: TextSegment[]): string {
	return segments
		.map((segment) =>
			typeof segment === 'string' ? segment : segment.strong ? `##${segment.text}##` : segment.text
		)
		.join('');
}
