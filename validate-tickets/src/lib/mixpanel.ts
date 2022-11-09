import mixpanel from "mixpanel-browser";

export type EventName = "authenticated" | "scan" | "error";
export type CounterName = "scans";

export class MixpanelService {
  private static readonly MIXPANEL_TOKEN = "e53a9ee9a6a4f93943486bb01692c770";
  /**
   * If the user has accepted cookies, initialize Mixpanel
   */
  static init() {
    mixpanel.init(this.MIXPANEL_TOKEN, {
      // debug: window.location.hostname !== "reports.prisma-safety.com",
      debug: true,
      persistence_name: '_lb22_junior_prom',
      persistence: 'localStorage',
    });

    console.log("Initialized Mixpanel.");
  }

  /**
   * Track an event or an error.
   *
   * @param name Name of the event. @see EventName for event name list.
   * @param additional Any additional params. Defaults to `undefined`
   */
  static event(name: EventName, additional: any = undefined) {
    mixpanel.track(name, additional);
  }

  /**
   * Increment a counter (i.e.: the number of scans)
   * 
   * @param counterName Name of the counter to increment
   */
  static incrementCounter(counterName: CounterName) {
    mixpanel.people.increment(counterName);
  }

  /**
   * Remove all entries in localStorage
   */
  static clearStorage() {
    try {
      mixpanel.disable();
    } catch(_) {
      // May fail if it was never initialized
    }
    
    for (let index = 0; index < window.localStorage.length; index++) {
      window.localStorage.removeItem(window.localStorage.key(index) ?? "");
    }
  }
}