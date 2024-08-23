import { CubeTextureLoader, Vector2 } from "three";

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export const bloomPass = new UnrealBloomPass(
  new Vector2(window.innerWidth, window.innerHeight),
  8,
  1,
  0.05
);

const loader = new CubeTextureLoader();

export const skybox = loader.load([
  "/skybox/px.png",
  "/skybox/nx.png",
  "/skybox/py.png",
  "/skybox/ny.png",
  "/skybox/pz.png",
  "/skybox/nz.png",
]);
