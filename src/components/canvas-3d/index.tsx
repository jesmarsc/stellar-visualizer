import { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import { Vector3 } from "three";

import {
  bloomPass,
  generateParticles,
  generateParticles2,
  skybox,
} from "@/libs/three";

import { useNetworkStore } from "@/providers/network-provider";

import { GraphLink } from "@/stores/network-store";
import { uiStore } from "@/stores/ui-store";
import { LedgerStore } from "@/stores/ledger-store";

let graph = ForceGraph3D({ controlType: "orbit" })
  .nodeId("publicKey")
  .nodeLabel((node: any) => node.name || node.publicKey)
  .nodeAutoColorBy((node: any) => node.organizationId)
  .nodeOpacity(1)
  .nodeRelSize(4)
  .nodeResolution(1)
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
  .linkResolution(1)
  .enableNodeDrag(false)
  .warmupTicks(100)
  .cooldownTicks(0)
  .cooldownTime(0)
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
  })
  .width(window.innerWidth)
  .height(window.innerHeight);

graph.d3Force("link")?.strength((link: GraphLink) => {
  if (link.isTransitiveQuorum) return 0.01;
  if (link.isStronglyConnected) return 0.1;
  return 0;
});

graph.cameraPosition({ x: 0, y: 0, z: 1000 }, { x: 0, y: 0, z: 0 });

export const Canvas3D = () => {
  const networkStore = useNetworkStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      graph(canvasRef.current);
      graph.graphData(networkStore.graphData);
      graph.postProcessingComposer().addPass(bloomPass);
      graph.scene().background = skybox;

      const controls = graph.controls() as any;
      controls.enableDamping = true;

      window.addEventListener("resize", () => {
        graph.height(window.innerHeight);
        graph.width(window.innerWidth);
      });
    }
  }, []);

  return (
    <div
      ref={canvasRef}
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          uiStore.selectedNode = undefined;
          graph.refresh();
        }
      }}
    />
  );
};
