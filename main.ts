import {
	Notice,
	Plugin,
	FuzzySuggestModal,
	moment
} from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

const getFiles = (fileMap: {}, strategy: NOTE_QUERY_STRAT) => {
	switch (strategy) {
		case NOTE_QUERY_STRAT.DAILY:
			return getFilesOnThisDayWeekStrategy(fileMap);
		case NOTE_QUERY_STRAT.MONTHLY:
			return getFilesOnThisDayMonthStrategy(fileMap);
		case NOTE_QUERY_STRAT.YEARLY:
			return getFilesOnThisDayYearStrategy(fileMap);
	}
}

interface cleanDate {
	month: string;
	day: string;
}

const getCleanDate = (date: Date): cleanDate => {
	const prepadmonth = date.getMonth() + 1;
	const month = prepadmonth < 10 ? "0" + prepadmonth : `${prepadmonth}`;
	const prepadDay = date.getDate();
	const day = prepadDay < 10 ? "0" + prepadDay : `${prepadDay}`;
	return {
		month,
		day
	}
};

/**
 * Past 7 days.
 * @param fileMap
 */
const getFilesOnThisDayWeekStrategy = (fileMap: {}) => {
	return Object.keys(fileMap).filter((key) => {
		const match = new RegExp(/\/+(?<noteDate>[0-9]{8})\.md$/).exec(key);
		if(match === null) return false;
		const noteDate = match.groups.noteDate;
		const endWindow = moment();
		const startWindow = endWindow.clone().subtract(7, 'day');
		return moment(noteDate).isBetween(startWindow, endWindow);
	});
}

const getFilesOnThisDayMonthStrategy = (fileMap: {}) => {
	return Object.keys(fileMap).filter((key) => {
		const now = new Date();
		const cleanDate = getCleanDate(now);
		const regex = new RegExp("2024" + "\\d\\d" + cleanDate.day + "\.md");
		return regex.test(key);
	});
}

const getFilesOnThisDayYearStrategy = (fileMap: {}) => {
	return Object.keys(fileMap).filter((key) => {
		const now = new Date();
		const cleanDate = getCleanDate(now);
		const regex = new RegExp("20\\d\\d" + cleanDate.month + cleanDate.day + "\.md");
		return regex.test(key);
	});
}


export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This one can be a book? Or the tally
		const ribbonYearly = this.addRibbonIcon('database', 'View notes on this day from past years', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new NoteEntriesSuggestionsModal(this.app, NOTE_QUERY_STRAT.YEARLY).open();
		});

		// This one can be a calendar
		const ribbonMonthly = this.addRibbonIcon('calendar-range', 'View notes on this day from past months', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new NoteEntriesSuggestionsModal(this.app, NOTE_QUERY_STRAT.MONTHLY).open();
		});

		// Getting rid of this because I think it is noisy.
		// // I think this one should be the newspaper because it is the most recent
		// const ribbonPastWeek = this.addRibbonIcon('tally-5', 'View notes from this past week', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new NoteEntriesSuggestionsModal(this.app, NOTE_QUERY_STRAT.DAILY).open();
		// });

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Did you reflect on your notes, today?');
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

interface SlimFile {
	path: string;
	name: string;
}


enum NOTE_QUERY_STRAT {
	YEARLY,
	MONTHLY,
	DAILY
}
/**
 * Will show entries based on config
 */
export class NoteEntriesSuggestionsModal extends FuzzySuggestModal<SlimFile> {
	private noteQueryStrat: NOTE_QUERY_STRAT;
	private results: any[];
	private OPEN_ALL = "Open all";
	private WARNING_OPEN_ALL = "Will open all results, be careful in selecting this options for big sets"

	constructor(app: App, strat: NOTE_QUERY_STRAT = NOTE_QUERY_STRAT.YEARLY) {
		super(app);
		this.noteQueryStrat = strat;
	}
	// Returns all available suggestions.
	getItems(): SlimFile[] {
		const fmp = this.app.vault.fileMap;
		this.results = [
			{name: this.OPEN_ALL, path: this.WARNING_OPEN_ALL},
			...getFiles(fmp, this.noteQueryStrat)
				.map(key => fmp[key])]
		return this.results;
	}

	getItemText(slimFile: SlimFile) {
		return `${slimFile.name} | (${slimFile.path})`;
	}

	// Perform action on the selected suggestion.
	onChooseItem(slimFile: SlimFile, evt: MouseEvent | KeyboardEvent) {
		// TODO, pick from different messages in the future
		new Notice(`Good choice. Happy reflecting. Enable me to choose random messages in the future`);
		if(slimFile.name === this.OPEN_ALL){
			const first = this.results[1];
			this.app.workspace.getLeaf(true).openFile(this.app.vault.fileMap[first.path]);
			// this.app.workspace.getLeaf(true);
			setTimeout(() => {
				this.results.slice(2,this.results.length).forEach(sFile => {
					this.app.workspace.getLeaf(true).openFile(this.app.vault.fileMap[sFile.path])
				})
			}, 50);
		} else {
			this.app.workspace.getLeaf().openFile(this.app.vault.fileMap[slimFile.path]);
		}
	}
}
