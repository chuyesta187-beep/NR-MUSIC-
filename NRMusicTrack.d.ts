import { NRMusic } from '../../NRMusic';
import { RawTrack, ResolveOptions } from '../../Modules/Interfaces';
import { Track } from 'shoukaku';
export declare class NRMusicTrack {
    private readonly raw;
    /**
     * NRMusic Instance
     */
    nrmusic: NRMusic | undefined;
    /**
     * Track Requester
     */
    requester: unknown | undefined;
    /** Track's Base64 */
    track: string;
    /** Track's source */
    sourceName: string;
    /** Track's title */
    title: string;
    /** Track's URI */
    uri?: string;
    /** Track's identifier */
    identifier: string;
    /** Whether the track is seekable */
    isSeekable: boolean;
    /** Whether the track is a stream */
    isStream: boolean;
    /** Track's author */
    author: string | undefined;
    /** Track's length */
    length: number | undefined;
    /** Track's position (I don't know this) */
    position: number | undefined;
    /** Track's thumbnail, if available */
    thumbnail: string | undefined;
    /** The YouTube/soundcloud URI for spotify and other unsupported source */
    realUri?: string;
    resolvedBySource: boolean;
    constructor(raw: Track, requester: unknown);
    /**
     * Get json of this track
     * @returns {RawTrack}
     */
    getRaw(): RawTrack;
    /**
     * Set nrmusic instance
     * @param nrmusic NRMusic instance
     * @returns NRMusicTrack
     */
    setNRMusic(nrmusic: NRMusic): NRMusicTrack;
    /**
     * Whether the track is ready to play or need to be solved
     */
    get readyToPlay(): boolean;
    /**
     * Resolve the track
     * @param options Resolve options
     * @returns Promise<NRMusicTrack>
     */
    resolve(options?: ResolveOptions): Promise<NRMusicTrack>;
    private getTrack;
}
