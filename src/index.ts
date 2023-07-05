import notifee, { Event, EventType } from "@notifee/react-native";
import { ModuleWithStatics } from "@notifee/react-native/dist/types/Module";
import { ReactNativeFirebase } from "@react-native-firebase/app";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

interface DittofeedReactNativeInit {}

type Firebase = ReactNativeFirebase.FirebaseModuleWithStatics<
  FirebaseMessagingTypes.Module,
  FirebaseMessagingTypes.Statics
>;

type DisplayNotificationParam = Parameters<
  typeof notifee.displayNotification
>[0];

type OnBackgroundEvent = (
  preRendered: DisplayNotificationParam,
  event: Event
) => Promise<DisplayNotificationParam>;

export class DittofeedReactNative2 {
  notifee: ModuleWithStatics;
  firebase: Firebase;
  onBackgroundEvent: OnBackgroundEvent;

  constructor(
    notifee: ModuleWithStatics,
    firebase: Firebase,
    onBackgroundEvent: OnBackgroundEvent
  ) {
    this.notifee = notifee;
    this.firebase = firebase;
    this.onBackgroundEvent = onBackgroundEvent;
  }

  async init() {
    notifee.onBackgroundEvent(async (event) => {
      const { type } = event;

      if (type !== EventType.DELIVERED) {
        void this.trackEvent(event);
      }
      const rendered = this.renderEvent(event);
      if (!rendered) {
        return;
      }
      const display = await this.onBackgroundEvent(rendered, event);
      await notifee.displayNotification(display);
    });
  }

  renderEvent(event: Event): DisplayNotificationParam | null {
    return null;
  }

  async trackEvent(event: Event): Promise<void> {}
}

// FIXME rename to DittofeedSDK
export class DittofeedReactNative {
  private static instance: DittofeedReactNative;

  constructor() {
    console.log("DittofeedReactNative constructor");
  }

  // FIXME rename init
  static async getInstance(
    initParams: DittofeedReactNativeInit
  ): Promise<DittofeedReactNative> {
    if (!DittofeedReactNative.instance) {
      DittofeedReactNative.instance = new DittofeedReactNative();
      await DittofeedReactNative.instance.init(initParams);
    }
    return DittofeedReactNative.instance;
  }

  private async init({}: DittofeedReactNativeInit) {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    // TODO inject overridable logger
    void this.submitToken(token).catch(console.error);
    // TODO allow channel to be overridden
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      visibility: 1,
      importance: 4,
    });
    messaging().onTokenRefresh(this.submitToken);
    notifee.onBackgroundEvent(this.handlBackgroundEvent);
  }

  private async submitToken(token: string): Promise<void> {
    console.log("submitToken", token);
  }

  private async handlBackgroundEvent(event: Event): Promise<void> {
    console.log("handlBackgroundEvent", event);
  }
}
