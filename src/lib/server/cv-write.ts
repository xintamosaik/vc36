let pending: Promise<unknown> = Promise.resolve();

// Keep reference checks and their writes together across requests in this local server.
export function withCvWrite<T>(write: () => Promise<T>): Promise<T> {
	const result = pending.then(write);
	pending = result.catch(() => {});
	return result;
}
