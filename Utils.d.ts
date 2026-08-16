import { Track } from 'shoukaku';
import { NRMusicTrack } from '../Managers/Supports/NRMusicTrack';
export declare class NRMusicUtils {
    static convertNRMusicTrackToTrack(track: NRMusicTrack | Track): Track;
}
export type Constructor<T> = new (...args: any[]) => T;
