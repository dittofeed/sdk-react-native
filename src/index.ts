import axios, { AxiosError } from "axios";
import { BatchQueue } from "./batchQueue";
import uuid from "react-native-uuid";

const uuidv4 = () => uuid.v4() as string;

export enum EventType {
  Identify = "identify",
  Track = "track",
  Page = "page",
  Screen = "screen",
}

export type AppDataContext = Record<string, any>;

export interface BaseAppData {
  messageId?: string;
  timestamp?: string;
}

export interface BaseIdentifyData extends BaseAppData {
  context?: AppDataContext;
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
  context?: AppDataContext;
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
  context?: AppDataContext;
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
  context?: AppDataContext;
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
  context?: AppDataContext;
}

export interface InitParams {
  writeKey: string;
  host?: string;
}

interface ErrorResponse {
  message?: string;
}

export class DittofeedSdk {
  private static instance: DittofeedSdk;
  private batchQueue: BatchQueue<BatchItem>;

  constructor({ writeKey, host = "https://dittofeed.com" }: InitParams) {
    this.batchQueue = new BatchQueue<BatchItem>({
      timeout: 500,
      batchSize: 5,
      executeBatch: async (batch) => {
        const data: BatchAppData = {
          batch,
        };
        try {
          const config = {
            method: "post",
            url: `${host}/api/public/apps/batch`,
            data,
            headers: {
              authorization: writeKey,
            },
          };
          await axios(config);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ErrorResponse>;
            // Handle AxiosError

            if (axiosError.response) {
              if (axiosError.response?.data?.message) {
                console.error(
                  `Dittofeed Error: ${axiosError.response.status} ${axiosError.response.data.message}`
                );
              } else {
                console.error(`Dittofeed Error: ${axiosError.response.status}`);
              }
            } else {
              console.error(
                `Dittofeed Error: unknown network ${axiosError.message}`
              );
            }
          } else {
            console.error(`Dittofeed Error: unknown ${String(error)}`);
          }
        }
      },
    });
  }

  static async init(initParams: InitParams): Promise<DittofeedSdk> {
    if (!DittofeedSdk.instance) {
      DittofeedSdk.instance = new DittofeedSdk(initParams);
    }
    return DittofeedSdk.instance;
  }

  public static identify(params: IdentifyData) {
    const data: BatchIdentifyData = {
      messageId: params.messageId ?? uuidv4(),
      type: EventType.Identify,
      ...params,
    };
    this.instance.batchQueue.submit(data);
  }

  public static track(params: TrackData) {
    const data: BatchTrackData = {
      messageId: params.messageId ?? uuidv4(),
      type: EventType.Track,
      ...params,
    };
    this.instance.batchQueue.submit(data);
  }

  public static page(params: PageData) {
    const data: BatchPageData = {
      messageId: params.messageId ?? uuidv4(),
      type: EventType.Page,
      ...params,
    };
    this.instance.batchQueue.submit(data);
  }

  public static screen(params: ScreenData) {
    const data: BatchScreenData = {
      messageId: params.messageId ?? uuidv4(),
      type: EventType.Screen,
      ...params,
    };
    this.instance.batchQueue.submit(data);
  }

  public static async flush() {
    await this.instance.batchQueue.flush();
  }
}
