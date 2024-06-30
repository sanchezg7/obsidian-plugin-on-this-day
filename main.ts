import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	FuzzySuggestModal
} from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}
const getFilesOnThisDay = (fileMap: {}) => {
	return Object.keys(fileMap).filter((key) => {
		const now = new Date();
		const prepadmonth = now.getMonth() + 1;
		const month = prepadmonth < 10 ? "0" + prepadmonth : prepadmonth;
		const day = now.getDate();
		const regex = new RegExp("20\\d\\d" + month + day + "\.md");
		return regex.test(key);
	});
}


export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("atom", "Open on this day", async () => {
			// new Notice("Clicked!");
			const { vault } = this.app;
			const filesOnThisDay = getFilesOnThisDay(vault.fileMap)
			// assumes one file only
			if(filesOnThisDay.length === 1) {
				this.app.workspace.activeLeaf.openFile(vault.fileMap[filesOnThisDay[0]]);
			}
			new Notice(JSON.stringify(filesOnThisDay));
		});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new OnThisDaySuggestions(this.app).open();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Did you read notes on this day, already?');


		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

interface SlimFile {
	path: string;
	name: string;
}


export class OnThisDaySuggestions extends FuzzySuggestModal<SlimFile> {
	// Returns all available suggestions.
	getItems(): SlimFile[] {
		const fmp = this.app.vault.fileMap;
		return getFilesOnThisDay(fmp)
			.map(key => fmp[key])
	}

	getItemText(slimFile: SlimFile) {
		return `${slimFile.name} | (${slimFile.path})`;
	}

	// Perform action on the selected suggestion.
	onChooseItem() {
		// TODO, pick from different messages in the future
		new Notice(`Good choice. Happy reflecting. Enable me to choose random messages in the future`);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
