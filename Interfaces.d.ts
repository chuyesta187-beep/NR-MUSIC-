import { NRMusic } from '../NRMusic';
import { NRMusicPlayer, NRMusicQueue } from '../Index';
import { NRMusicTrack } from '../Managers/Supports/NRMusicTrack';
import { Constructor } from './Utils';
import { Track } from 'shoukaku';
export interface NRMusicOptions {
    /** Default search engine if no engine was provided. Default to youtube. If defaultSource is provided, this will be ignored */
    defaultSearchEngine: SearchEngines;
    /** Default source if no source was provided. Default to defaultSearchEngine */
    defaultSource?: string;
    /** NRMusic plugins */
    plugins?: NRMusicPlugin[];
    /** Source that will be forced to resolve when playing it */
    sourceForceResolve?: string[];
    /** The track resolver. Make sure you set <NRMusicTrack>.track for it to work. (I'm not responsible for any error during playback if you don't set it right) */
    trackResolver?: (this: NRMusicTrack, options?: ResolveOptions) => Promise<boolean>;
    /** The default youtube thumbnail's size */
    defaultYoutubeThumbnail?: YoutubeThumbnail;
    /** Extend some of the Structures */
    extends?: {
        player?: Constructor<NRMusicPlayer>;
    };
    /** Send to guild's shard */
    send: (guildId: string, payload: Payload) => void;
}
export type SearchEngines = 'youtube' | 'soundcloud' | 'youtube_music' | string;
export type YoutubeThumbnail = 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault';
export interface Payload {
    /** The OP code */
    op: number;
    d: {
        guild_id: string;
        channel_id: string | null;
        self_mute: boolean;
        self_deaf: boolean;
    };
}
export declare const escapeRegExp: (str: string) => string;
export declare const SourceIDs: {
    youtube: string;
    youtube_music: string;
    soundcloud: string;
};
export interface NRMusicPlayerOptions {
    guildId: string;
    voiceId: string;
    textId?: string;
    deaf: boolean;
    volume: number;
    /** Whether the node for searching track should be the same as the node for playing track. Default: true */
    searchWithSameNode?: boolean;
    extends?: {
        queue?: Constructor<NRMusicQueue>;
    };
}
export interface ResolveOptions {
    overwrite?: boolean;
    forceResolve?: boolean;
    player?: NRMusicPlayer;
}
export interface CreatePlayerOptions {
    /** The player's guild ID */
    guildId: string;
    /** The player's voice ID */
    voiceId: string;
    /** The player's text ID */
    textId?: string;
    /** Whether the bot should deafen */
    deaf?: boolean;
    /** Whether the bot should mute */
    mute?: boolean;
    /** The player's guild's shardId */
    shardId?: number;
    /** Balance the node? */
    loadBalancer?: boolean;
    /** The player's volume */
    volume?: number;
    /** Use specific node */
    nodeName?: string;
    /** The player's data, usable when you extends it */
    data?: unknown;
}
export interface RawTrack {
    track: string;
    info: {
        title: string;
        uri?: string;
        identifier: string;
        sourceName: string;
        isSeekable: boolean;
        isStream: boolean;
        author?: string;
        length?: number;
        position?: number;
        artworkUrl?: string;
    };
    _raw: Track;
}
export declare const Events: {
    PlayerDestroy: string;
    PlayerCreate: string;
    PlayerStart: string;
    PlayerEnd: string;
    PlayerEmpty: string;
    PlayerClosed: string;
    PlayerUpdate: string;
    PlayerException: string;
    PlayerError: string;
    PlayerResumed: string;
    PlayerStuck: string;
    PlayerResolveError: string;
    PlayerMoved: string;
    QueueUpdate: string;
    Debug: string;
};
export interface PlayerMovedChannels {
    oldChannelId?: string | null;
    newChannelId?: string | null;
}
export type PlayerMovedState = 'UNKNOWN' | 'JOINED' | 'LEFT' | 'MOVED';
export interface NRMusicSearchOptions {
    requester: unknown;
    source?: string;
    engine?: SearchEngines;
    nodeName?: string;
}
export interface NRMusicSearchResult {
    type: SearchResultTypes;
    playlistName?: string;
    tracks: NRMusicTrack[];
}
export type SearchResultTypes = 'PLAYLIST' | 'TRACK' | 'SEARCH';
export declare const SupportedSources: string[];
export interface PlayOptions {
    position?: number;
    endTime?: number;
    volume?: number;
    paused?: boolean;
    replaceCurrent?: boolean;
}
export declare enum PlayerState {
    CONNECTING = 0,
    CONNECTED = 1,
    DISCONNECTING = 2,
    DISCONNECTED = 3,
    DESTROYING = 4,
    DESTROYED = 5
}
export declare class NRMusicPlugin {
    load(nrmusic: NRMusic): void;
    unload(nrmusic: NRMusic): void;
}
export declare class NRMusicError extends Error {
    code: number;
    message: string;
    constructor(code: number, message: string);
}
