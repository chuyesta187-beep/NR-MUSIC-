import { NRMusic } from '../NRMusic';
import { NRMusicQueue } from './Supports/NRMusicQueue';
import { FilterOptions, Player } from 'shoukaku';
import { NRMusicPlayerOptions, NRMusicSearchOptions, NRMusicSearchResult, PlayerState, PlayOptions } from '../Modules/Interfaces';
import { NRMusicTrack } from './Supports/NRMusicTrack';
export declare class NRMusicPlayer {
    private readonly customData;
    /**
     * NRMusic options
     */
    private options;
    /**
     * NRMusic Instance
     */
    readonly nrmusic: NRMusic;
    /**
     * Shoukaku's Player instance
     */
    shoukaku: Player;
    /**
     * The guild ID of the player
     */
    readonly guildId: string;
    /**
     * The voice channel ID of the player
     */
    voiceId: string | null;
    /**
     * The text channel ID of the player
     */
    textId?: string;
    /**
     * Player's queue
     */
    readonly queue: NRMusicQueue;
    /**
     * Get the current state of the player
     */
    state: PlayerState;
    /**
     * Paused state of the player
     */
    paused: boolean;
    /**
     * Whether the player is playing or not
     */
    playing: boolean;
    /**
     * Loop status
     */
    loop: 'none' | 'queue' | 'track';
    /**
     * Search track/s
     */
    search: (query: string, options?: NRMusicSearchOptions) => Promise<NRMusicSearchResult>;
    /**
     * Player's volume in percentage (default 100%)
     */
    volume: number;
    /**
     * Player's custom data
     */
    readonly data: Map<string, any>;
    /**
     * Initialize the player
     * @param nrmusic NRMusic instance
     * @param player Shoukaku's Player instance
     * @param options NRMusic options
     * @param customData private readonly customData
     */
    constructor(nrmusic: NRMusic, player: Player, options: NRMusicPlayerOptions, customData: unknown);
    /**
     * Get player position
     */
    get position(): number;
    /**
     * Get filters
     */
    get filters(): FilterOptions;
    private get node();
    /**
     * Pause the player
     * @param pause Whether to pause or not
     * @returns NRMusicPlayer
     */
    pause(pause: boolean): NRMusicPlayer;
    /**
     * Set text channel
     * @param textId Text channel ID
     * @returns NRMusicPlayer
     */
    setTextChannel(textId: string): NRMusicPlayer;
    /**
     * Set voice channel and move the player to the voice channel
     * @param voiceId Voice channel ID
     * @returns NRMusicPlayer
     */
    setVoiceChannel(voiceId: string): NRMusicPlayer;
    /**
     * Get the previous track from the queue
     * @param remove Whether to remove the track from the previous list or not. Best to set to true if you want to play it
     */
    getPrevious(remove?: boolean): NRMusicTrack | undefined;
    /**
     * Set loop mode
     * @param [loop] Loop mode
     * @returns NRMusicPlayer
     */
    setLoop(loop?: 'none' | 'queue' | 'track'): NRMusicPlayer;
    /**
     * Play a track
     * @param track Track to play
     * @param options Play options
     * @returns NRMusicPlayer
     */
    play(track?: NRMusicTrack, options?: PlayOptions): Promise<NRMusicPlayer>;
    /**
     * Skip the current track
     * @returns NRMusicPlayer
     */
    skip(): NRMusicPlayer;
    /**
     * Seek to a position
     * @param position Position in seconds
     * @returns NRMusicPlayer
     */
    seek(position: number): Promise<NRMusicPlayer>;
    /**
     * Set the volume in percentage (default 100%)
     * @param volume Volume
     * @returns NRMusicPlayer
     */
    setVolume(volume: number): Promise<NRMusicPlayer>;
    /**
     * Connect to the voice channel
     * @returns NRMusicPlayer
     */
    connect(): NRMusicPlayer;
    /**
     * Disconnect from the voice channel
     * @returns NRMusicPlayer
     */
    disconnect(): NRMusicPlayer;
    /**
     * Destroy the player
     * @returns NRMusicPlayer
     */
    destroy(): Promise<NRMusicPlayer>;
    private emit;
}
