export function selectedIndexAfterRemoval(
	selectedIndex: number,
	removedIndex: number,
	newLength: number
): number {
	if (newLength === 0) return -1;
	if (selectedIndex === removedIndex) return Math.min(removedIndex, newLength - 1);
	return selectedIndex > removedIndex ? selectedIndex - 1 : selectedIndex;
}
