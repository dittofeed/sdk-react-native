export enum EventType {
  Identify = "identify",
  Track = "track",
  Page = "page",
  Screen = "screen",
}

export type AppDataContext = Record<string, any> | undefined;

export interface BaseAppData {
  messageId: string;
  timestamp?: string;
}

export interface BaseIdentifyData extends BaseAppData {
  context: AppDataContext;
  traits?: Record<string, any>;
}

export interface BaseBatchIdentifyData extends BaseAppData {
  type: EventType.Identify;
  traits?: Record<string, any>;
}

export interface KnownIdentifyData extends BaseIdentifyData {
  userId: string;
}

export interface AnonymousIdentifyData extends BaseIdentifyData {
  userId: string;
}

export type IdentifyData = KnownIdentifyData | AnonymousIdentifyData;

export interface BatchIdentifyDataWithUserId extends BaseBatchIdentifyData {
  userId: string;
}

export interface BatchIdentifyDataWithAnonymousId
  extends BaseBatchIdentifyData {
  anonymousId: string;
}

export type BatchIdentifyData =
  | BatchIdentifyDataWithUserId
  | BatchIdentifyDataWithAnonymousId;

export interface BaseTrackData extends BaseAppData {
  context: AppDataContext;
  event: string;
  properties?: Record<string, any>;
}

export interface BaseBatchTrackData extends BaseAppData {
  type: EventType.Track;
  event: string;
  properties?: Record<string, any>;
}

export interface KnownTrackData extends BaseTrackData {
  userId: string;
}

export interface AnonymousTrackData extends BaseTrackData {
  anonymousId: string;
}

export type TrackData = KnownTrackData | AnonymousTrackData;

export interface BatchTrackDataWithUserId extends BaseBatchTrackData {
  userId: string;
}

export interface BatchTrackDataWithAnonymousId extends BaseBatchTrackData {
  anonymousId: string;
}

export type BatchTrackData =
  | BatchTrackDataWithUserId
  | BatchTrackDataWithAnonymousId;

export interface BasePageData extends BaseAppData {
  context: AppDataContext;
  name?: string;
  properties?: Record<string, any>;
}

export interface BaseBatchPageData extends BaseAppData {
  type: EventType.Page;
  name?: string;
  properties?: Record<string, any>;
}

export interface KnownPageData extends BasePageData {
  userId: string;
}

export interface AnonymousPageData extends BasePageData {
  anonymousId: string;
}

export type PageData = KnownPageData | AnonymousPageData;

export interface BatchPageDataWithUserId extends BaseBatchPageData {
  userId: string;
}

export interface BatchPageDataWithAnonymousId extends BaseBatchPageData {
  anonymousId: string;
}

export type BatchPageData =
  | BatchPageDataWithUserId
  | BatchPageDataWithAnonymousId;

export interface BaseScreenData extends BaseAppData {
  context: AppDataContext;
  name?: string;
  properties?: Record<string, any>;
}

export interface BaseBatchScreenData extends BaseAppData {
  type: EventType.Screen;
  name?: string;
  properties?: Record<string, any>;
}

export interface KnownScreenData extends BaseScreenData {
  userId: string;
}

export interface AnonymousScreenData extends BaseScreenData {
  anonymousId: string;
}

export type ScreenData = KnownScreenData | AnonymousScreenData;

export interface BatchScreenDataWithUserId extends BaseBatchScreenData {
  userId: string;
}

export interface BatchScreenDataWithAnonymousId extends BaseBatchScreenData {
  anonymousId: string;
}

export type BatchScreenData =
  | BatchScreenDataWithUserId
  | BatchScreenDataWithAnonymousId;

export type BatchItem =
  | BatchIdentifyData
  | BatchTrackData
  | BatchPageData
  | BatchScreenData;

export interface BatchAppData {
  batch: BatchItem[];
  context: AppDataContext;
}

export interface InitParams {
  writeKey: string;
}

export class DittofeedSdk {
  private static instance: DittofeedSdk;
  private writeKey: string;

  constructor({ writeKey }: InitParams) {
    writeKey = writeKey;
  }

  static async init(initParams: InitParams): Promise<DittofeedSdk> {
    if (!DittofeedSdk.instance) {
      DittofeedSdk.instance = new DittofeedSdk(initParams);
    }
    return DittofeedSdk.instance;
  }

  public static async identify(): Promise<void> {
    console.log("identify");
  }
}
