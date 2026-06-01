import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

export type QuestionType = 'arsenal_positive' | 'arsenal_general' | 'rival_schadenfreude';

export type Question = {
	id: string;
	prompt: string;
	choices: [string, string, string, string];
	correctIndex: 0 | 1 | 2 | 3;
	difficulty: 1 | 2 | 3;
	explanation: string;
	questionType?: QuestionType;
	rivalTeamId?: string;
};

export type Pack = {
	id: string;
	title: string;
	category: string;
	description: string;
	questions: Question[];
};

export type RivalTeam = {
	id: string;
	name: string;
	nickname: string;
	primaryColor: string;
	secondaryColor: string;
};

const PACKS_DIR = resolve('src/lib/data/packs');
const RIVAL_TEAMS_FILE = resolve('src/lib/data/rival-teams.json');

export function listPacks(): Pack[] {
	return readdirSync(PACKS_DIR)
		.filter((f: string) => f.endsWith('.json'))
		.map((f: string) => JSON.parse(readFileSync(resolve(PACKS_DIR, f), 'utf-8')) as Pack)
		.sort((a: Pack, b: Pack) => a.title.localeCompare(b.title));
}

export function getPack(id: string): Pack | null {
	const file = resolve(PACKS_DIR, `${id}.json`);
	try {
		return JSON.parse(readFileSync(file, 'utf-8')) as Pack;
	} catch {
		return null;
	}
}

export function listRivalTeams(): RivalTeam[] {
	return JSON.parse(readFileSync(RIVAL_TEAMS_FILE, 'utf-8')) as RivalTeam[];
}

export function getRivalTeam(id: string): RivalTeam | null {
	const teams = listRivalTeams();
	return teams.find((t) => t.id === id) ?? null;
}
