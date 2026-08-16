// import { NodeOption, PlayerUpdate, ShoukakuOptions, TrackExceptionEvent, WebSocketClosedEvent } from "shoukaku";
import { NRMusicTrack } from './Managers/Supports/NRMusicTrack';
import { NRMusicQueue } from './Managers/Supports/NRMusicQueue';
import { NRMusicPlayer } from './Managers/NRMusicPlayer';
import Plugins from './Modules/Plugins';
// import NRMusicPlayer from "./Managers/NRMusicPlayer";
// import { NRMusicOptions } from "./Modules/Interfaces";
// import { Connector } from "shoukaku/dist/src/connectors/Connector";

export * from './NRMusic';
export { NRMusicTrack, NRMusicQueue, NRMusicPlayer, Plugins };
export * from './Modules/Interfaces';

export const version = '3.4.2';
