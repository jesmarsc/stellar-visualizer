import { Ledger } from "@/types/horizon";

import { api } from "@/api";

const url = new URL(api.HORIZON + "/ledgers");
url.searchParams.append("order", "asc");
url.searchParams.append("cursor", "now");

export class LedgerStore {
  ledgers: Ledger[] = [];

  constructor() {
    this.ledgers = [];

    const eventSource = new EventSource(url);

    const onMessage = (event: MessageEvent<any>) => {
      const ledger = JSON.parse(event.data) as Ledger;
      this.ledgers.push(ledger);
      console.log(ledger);
    };

    eventSource.addEventListener("message", onMessage.bind(this));
  }
}
