import { Ledger } from "@/types/horizon";

import { api } from "@/api";
import { Rocket } from "@/libs/three/rocket";

const url = new URL(api.HORIZON + "/ledgers");
url.searchParams.append("order", "asc");
url.searchParams.append("cursor", "now");

const MAX_ROCKETS = 5;

export class LedgerStore {
  rockets: Rocket[] = [];
  disposedRockets: Rocket[] = [];
  onMessage?: (rocket: Rocket) => void;

  constructor() {
    this.rockets = [];

    const eventSource = new EventSource(url);

    const onMessage = (event: MessageEvent<any>) => {
      const ledger = JSON.parse(event.data) as Ledger;
      const rocket = new Rocket(ledger);

      this.rockets.push(rocket);
      this.onMessage?.(rocket);

      if (this.rockets.length > MAX_ROCKETS) {
        this.disposedRockets = this.rockets.splice(
          0,
          this.rockets.length - MAX_ROCKETS
        );

        this.disposedRockets.forEach((rocket) => rocket.dispose());
      }
    };

    eventSource.addEventListener("message", onMessage.bind(this));
  }
}

export const ledgerStore = new LedgerStore();
