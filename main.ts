import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}
// example from https://docs.obsidian.md/Plugins/Vault
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async averageFileLength(): Promise<number> {
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

	async onload() {
		this.addRibbonIcon("info", "Calculate average file length", async () => {
			const fileLength = await this.averageFileLength();
			new Notice(`The average file length is ${fileLength} characters.`);
		});
	}



	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
