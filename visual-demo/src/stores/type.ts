export interface ChinaTotal {
	nowSevere: number;
	noInfect: number;
	localConfirm: number;
	noInfectH5: number;
	nowConfirm: number;
	suspect: number;
	showlocalinfeciton: number;
	local_acc_confirm: number;
	heal: number;
	showLocalConfirm: number;
	localConfirmH5: number;
	dead: number;
	importedCase: number;
	confirm: number;
}

export interface ChinaAdd {
	dead: number;
	nowConfirm: number;
	localConfirm: number;
	localConfirmH5: number;
	confirm: number;
	suspect: number;
	nowSevere: number;
	importedCase: number;
	noInfect: number;
	noInfectH5: number;
	heal: number;
}

export interface ShowAddSwitch {
	suspect: boolean;
	nowConfirm: boolean;
	nowSevere: boolean;
	all: boolean;
	confirm: boolean;
	dead: boolean;
	heal: boolean;
	importedCase: boolean;
	noInfect: boolean;
	localConfirm: boolean;
	localinfeciton: boolean;
}

export interface Today {
	confirm: number;
	isUpdated: boolean;
}

export interface Total {
	heal: number;
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
}

export interface Today {
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
	tip: string;
	wzz_add: number;
}

export interface Total {
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
	heal: number;
}

export interface Today {
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
}

export interface Total {
	provinceLocalConfirm: number;
	nowConfirm: number;
	confirm: number;
	dead: number;
	showRate: boolean;
	heal: number;
	showHeal: boolean;
	wzz: number;
}

export interface Children {
	name: string;
	today: Today;
	total: Total;
}

export interface Children {
	name: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface AreaTree {
	name: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface Diseaseh5Shelf {
	lastUpdateTime: string;
	chinaTotal: ChinaTotal;
	chinaAdd: ChinaAdd;
	isShowAdd: boolean;
	showAddSwitch: ShowAddSwitch;
	areaTree: AreaTree[];
}

export interface StatisGradeCityDetail {
	confirmAdd: number;
	confirm: number;
	heal: number;
	grade: string;
	sdate: string;
	province: string;
	city: string;
	nowConfirm: number;
	dead: number;
	date: string;
	syear: number;
}

export interface RootObject {
	diseaseh5Shelf: Diseaseh5Shelf;
	statisGradeCityDetail: StatisGradeCityDetail[];
}