const averageFileLength(): Promise<number> = async () => {
	const { vault } = this.app;

	const fileContents: string[] = await Promise.all(
	vault.getMarkdownFiles().map((file) => vault.cachedRead(file))
);

let totalLength = 0;
fileContents.forEach((content) => {
	totalLength += content.length;
});

return totalLength / fileContents.length;
}

export {
	averageFileLength,
}
