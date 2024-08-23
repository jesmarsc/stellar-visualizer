import ForceGraph3D from "3d-force-graph";
import { Vector3 } from "three";

import { skybox } from "../three";

import { GraphLink } from "@/stores/network-store";
import { uiStore } from "@/stores/ui-store";

export const graph = ForceGraph3D({ controlType: "orbit" })
  .nodeId("publicKey")
  .nodeLabel((node: any) => node.name || node.publicKey)
  .nodeAutoColorBy((node: any) => node.organizationId)
  .nodeOpacity(1)
  .nodeRelSize(4)
  .nodeResolution(1)
  .linkResolution(1)
  .enableNodeDrag(false)
  .warmupTicks(100)
  .cooldownTicks(0)
  .cooldownTime(0)
  .width(window.innerWidth)
  .height(window.innerHeight)
  .linkColor((link: any) => {
    let opacity = 0.005;

    const pk = uiStore.selectedNode?.publicKey;

    if (pk && (link.target.publicKey === pk || link.source.publicKey === pk)) {
      opacity = 0.5;
    } else if (link.isTransitiveQuorum || link.isStronglyConnected) {
      opacity = 0.05;
    }

    return `rgba(255,255,255,${opacity})`;
  })
  .onNodeClick((node: any) => {
    uiStore.selectedNode = node;

    graph.refresh();

    const camera = graph.camera();
    const controls = graph.controls() as any;

    const nodePosition = new Vector3(node.x, node.y, node.z);

    const direction = new Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();

    const newPosition = new Vector3().addVectors(
      nodePosition,
      direction.multiplyScalar(100)
    );

    graph.cameraPosition(newPosition, nodePosition, 1000);
  });

graph.d3Force("link")?.strength((link: GraphLink) => {
  if (link.isTransitiveQuorum) return 0.01;
  if (link.isStronglyConnected) return 0.1;
  return 0;
});

graph.scene().background = skybox;
