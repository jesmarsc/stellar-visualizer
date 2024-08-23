import { LinkObject, NodeObject } from "three-forcegraph";

import { Network, Node, QuorumSet } from "@/types/stellar-beat";

export type GraphNode = NodeObject & Node;
export type GraphLink = LinkObject & {
  isTransitiveQuorum: boolean;
  isStronglyConnected: boolean;
};

export class NetworkStore {
  network: Network;

  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };

  nodeMap: Map<string, Node>;

  organizationMap: Map<string, Set<string>>;

  constructor(network: Network) {
    this.network = network;

    const links = this.uniqueLinks(
      network.nodes.flatMap((node) => this.linksFromNode(node, network))
    );

    const nodes = network.nodes.filter((node) =>
      links.some(
        (link) =>
          link.source === node.publicKey || link.target === node.publicKey
      )
    );

    this.graphData = {
      nodes,
      links,
    };

    this.nodeMap = this.mapFromNodeList(network.nodes);

    this.organizationMap = this.organizationMapFromNodeList(network.nodes);
  }

  mapFromNodeList(nodes: Node[]) {
    return nodes.reduce(
      (map, node) => map.set(node.publicKey, node),
      new Map<string, Node>()
    );
  }

  linksFromNode(node: Node, network: Network): GraphLink[] {
    const links: GraphLink[] = [];

    function _parseNetworkLinks(node: Node, quorumSet: QuorumSet) {
      const { validators, innerQuorumSets } = quorumSet;

      validators?.forEach((validator) => {
        if (validator !== node.publicKey) {
          const link = {
            source: node.publicKey,
            target: validator,
            isTransitiveQuorum:
              network.transitiveQuorumSet.includes(node.publicKey) &&
              network.transitiveQuorumSet.includes(validator),
            isStronglyConnected: network.scc.some(
              (scc) => scc.includes(node.publicKey) && scc.includes(validator)
            ),
          } satisfies GraphLink;

          links.push(link);
        }
      });

      innerQuorumSets.forEach((quorumSet) =>
        _parseNetworkLinks(node, quorumSet)
      );
    }

    if (node.quorumSet) _parseNetworkLinks(node, node.quorumSet);

    return links;
  }

  organizationMapFromNodeList(nodes: Node[]) {
    const organizationMap = new Map<string, Set<string>>();

    nodes
      .filter((node) => node.organizationId)
      .forEach((node) => {
        let organization = organizationMap.get(node.organizationId!);

        if (!organization) {
          organization = new Set();
          organizationMap.set(node.organizationId!, organization);
        }

        organization.add(node.publicKey);
      });

    return organizationMap;
  }

  uniqueLinks(links: GraphLink[]) {
    const uniqueLinks = new Set<string>();

    return links.filter((link) => {
      if (typeof link.source === "string" && typeof link.target === "string") {
        const id = JSON.stringify([link.source, link.target].sort());

        if (uniqueLinks.has(id)) return false;

        uniqueLinks.add(id);

        return true;
      }
    });
  }
}
