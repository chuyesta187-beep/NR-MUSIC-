import { EventEmitter } from 'events';
import { CreatePlayerOptions, NRMusicOptions as NRMusicOptionsOwO, NRMusicSearchOptions, NRMusicSearchResult, PlayerMovedChannels, PlayerMovedState } from './Modules/Interfaces';
import { Connector, Node, NodeOption, Player, PlayerUpdate, Shoukaku, ShoukakuOptions, TrackExceptionEvent, TrackStuckEvent, VoiceChannelOptions, WebSocketClosedEvent } from 'shoukaku';
import { NRMusicPlayer } from './Managers/NRMusicPlayer';
import { NRMusicTrack } from './Managers/Supports/NRMusicTrack';
import { NRMusicQueue } from './Managers/Supports/NRMusicQueue';
export interface NRMusicEvents {
    /**
     * Emitted when a track is going to play.
     * @event NRMusic#playerStart
     */
    playerStart: [player: NRMusicPlayer, track: NRMusicTrack];
    /**
     * Emitted when an error occured while resolving track.
     * @event NRMusic#playerResolveError
     */
    playerResolveError: [player: NRMusicPlayer, track: NRMusicTrack, message?: string];
    /**
     * Emitted when a player got destroyed.
     * @event NRMusic#playerDestroy
     */
    playerDestroy: [player: NRMusicPlayer];
    /**
     * Emitted when a player created.
     * @event NRMusic#playerCreate
     */
    playerCreate: [player: NRMusicPlayer];
    /**
     * Emitted when a track ended.
     * @event NRMusic#playerEnd
     */
    playerEnd: [player: NRMusicPlayer];
    /**
     * Emitted when a player got empty.
     * @event NRMusic#playerEmpty
     */
    playerEmpty: [player: NRMusicPlayer];
    /**
     * Emitted when a player got closed.
     * @event NRMusic#playerClosed
     */
    playerClosed: [player: NRMusicPlayer, data: WebSocketClosedEvent];
    /**
     * Emitted when a player got stuck.
     * @event NRMusic#playerStuck
     */
    playerStuck: [player: NRMusicPlayer, data: TrackStuckEvent];
    /**
     * Emitted when a player got resumed.
     * @event NRMusic#playerResumed
     */
    playerResumed: [player: NRMusicPlayer];
    /**
     * Emitted only when you use playerMoved plugin and when the bot moved, joined, or left voice channel.
     * @event NRMusic#playerMoved
     */
    playerMoved: [player: NRMusicPlayer, state: PlayerMovedState, channels: PlayerMovedChannels];
    /**
     * Emitted when an exception occured.
     * @event NRMusic#playerException
     */
    playerException: [player: NRMusicPlayer, data: TrackExceptionEvent];
    /**
     * Emitted when a player updated.
     * @event NRMusic#playerUpdate
     */
    playerUpdate: [player: NRMusicPlayer, data: PlayerUpdate];
    /**
     * Emitted for science purpose.
     * @event NRMusic#playerUpdate
     */
    /**
     * Emitted when a queue updated (track added, changed, etc).
     * @event NRMusic#queueUpdate
     */
    queueUpdate: [player: NRMusicPlayer, queue: NRMusicQueue];
}
export declare interface NRMusic {
    on<K extends keyof NRMusicEvents>(event: K, listener: (...args: NRMusicEvents[K]) => void): this;
    once<K extends keyof NRMusicEvents>(event: K, listener: (...args: NRMusicEvents[K]) => void): this;
    off<K extends keyof NRMusicEvents>(event: K, listener: (...args: NRMusicEvents[K]) => void): this;
    emit(event: string | symbol, ...args: any[]): boolean;
}
export declare class NRMusic extends EventEmitter {
    NRMusicOptions: NRMusicOptionsOwO;
    /** Shoukaku instance */
    shoukaku: Shoukaku;
    /** NRMusic players */
    readonly players: Map<string, NRMusicPlayer>;
    /**
     * Initialize a NRMusic instance.
     * @param NRMusicOptions NRMusicOptions
     * @param connector Connector
     * @param nodes NodeOption[]
     * @param options ShoukakuOptions
     */
    constructor(NRMusicOptions: NRMusicOptionsOwO, connector: Connector, nodes: NodeOption[], options?: ShoukakuOptions);
    protected createVoiceConnection(newPlayerOptions: VoiceChannelOptions, nrmusicPlayerOptions: CreatePlayerOptions): Promise<Player>;
    /**
     * Create a player.
     * @param options CreatePlayerOptions
     * @returns Promise<NRMusicPlayer>
     */
    createPlayer<T extends NRMusicPlayer>(options: CreatePlayerOptions): Promise<T | NRMusicPlayer>;
    /**
     * Get a player by guildId.
     * @param guildId Guild ID
     * @returns NRMusicPlayer | undefined
     */
    getPlayer<T extends NRMusicPlayer>(guildId: string): (T | NRMusicPlayer) | undefined;
    /**
     * Destroy a player.
     * @param guildId Guild ID
     * @returns void
     */
    destroyPlayer<T extends NRMusicPlayer>(guildId: string): void;
    /**
     * Get the least used node.
     * @param group The group where you want to get the least used nodes there. Case-sensitive, catch the error when there is no such group
     * @returns Node
     */
    getLeastUsedNode(group?: string): Promise<Node>;
    /**
     * Search a track by query or uri.
     * @param query Query
     * @param options NRMusicOptions
     * @returns Promise<NRMusicSearchResult>
     */
    search(query: string, options?: NRMusicSearchOptions): Promise<NRMusicSearchResult>;
    private buildSearch;
}
