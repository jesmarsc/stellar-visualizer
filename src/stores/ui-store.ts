import { proxy } from "valtio";

import { GraphNode } from "./network-store";

type State = {
  selectedNode?: GraphNode;
};

export const uiStore = proxy<State>({ selectedNode: undefined });
