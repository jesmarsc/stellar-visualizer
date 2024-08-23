import { useEffect, useRef } from "react";

import { bloomPass } from "@/libs/three";

import { useNetworkStore } from "@/providers/network-provider";

import { uiStore } from "@/stores/ui-store";
import { ledgerStore } from "@/stores/ledger-store";
import { graph } from "@/libs/3d-force-graph";

export const Canvas3D = () => {
  const networkStore = useNetworkStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      graph(canvasRef.current);
      graph.graphData(networkStore.graphData);
      graph.postProcessingComposer().addPass(bloomPass);

      const controls = graph.controls() as any;
      controls.enableDamping = true;

      graph.cameraPosition({ x: 500, y: 500, z: 500 }, { x: 0, y: 0, z: 0 });

      ledgerStore.onMessage = (rocket) => {
        graph.scene().add(rocket);
      };

      const animateRockets = (time: number) => {
        for (const rocket of ledgerStore.rockets) {
          rocket.animation(time);
        }

        for (const rocket of ledgerStore.disposedRockets) {
          rocket.animation(time);
        }

        requestAnimationFrame(animateRockets);
      };

      requestAnimationFrame(animateRockets);

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
