import { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

export const musixmatchMap = {
	catalog: ['chartTracksGet', 'matcherTrackGet', 'trackGet', 'trackLyricsGet', 'trackSubtitleGet'],
} as const;

export type MusixmatchMap = {
	[K in keyof typeof musixmatchMap]: (typeof musixmatchMap)[K][number];
};

export type MusixmatchAllEntities = AllEntities<MusixmatchMap>;

export type CatalogEntity = Entity<MusixmatchMap, 'catalog'>;
export type CatalogProperties = PropertiesOf<CatalogEntity>;
