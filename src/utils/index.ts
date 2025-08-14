export const generateUsername = (): string => {
	const usernamePrefix = 'user_';
	const randomChars = Math.random().toString(36).slice(2);
	const username = usernamePrefix + randomChars;
	return username;
};

export const genSlug = (title: string): string => {
	const slug = title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '') // Remove special characters
		.trim()
		.replace(/\s+/g, '-'); // Replace spaces with hyphens

	const randomChars = Math.random().toString(36).slice(2);
	const uniqueSlug = `${slug}-${randomChars}`;
	return uniqueSlug;
};
