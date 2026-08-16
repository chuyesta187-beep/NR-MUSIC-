import { NRMusicTrack } from './NRMusicTrack';
import { NRMusicPlayer } from '../NRMusicPlayer';
export declare class NRMusicQueue extends Array<NRMusicTrack> {
    private readonly nrmusicPlayer;
    constructor(nrmusicPlayer: NRMusicPlayer);
    /** Get the size of queue */
    get size(): number;
    /** Get the size of queue including current */
    get totalSize(): number;
    /** Check if the queue is empty or not */
    get isEmpty(): boolean;
    /** Get the queue's duration */
    get durationLength(): number;
    /** Current playing track */
    current: NRMusicTrack | undefined | null;
    /** Previous playing tracks */
    previous: NRMusicTrack[];
    /**
     * Add track(s) to the queue
     * @param track NRMusicTrack to add
     * @returns NRMusicQueue
     */
    add(track: NRMusicTrack | NRMusicTrack[]): NRMusicQueue;
    /**
     * Remove track from the queue
     * @param position Position of the track
     * @returns NRMusicQueue
     */
    remove(position: number): NRMusicQueue;
    /** Shuffle the queue */
    shuffle(): NRMusicQueue;
    /** Clear the queue */
    clear(): NRMusicQueue;
    private emitChanges;
}
