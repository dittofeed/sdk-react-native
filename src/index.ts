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
