import { Object3D, Vector3 } from "three";
import { Curve } from "three";
import { Curves, GLTFLoader } from "three/examples/jsm/Addons.js";

import { Ledger } from "@/types/horizon";

const ROCKET_SCALE = 1;
const CURVE_SCALE = 20;
const SPAWN_DISTANCE = 1000;
const VELOCITY = 10;

const rocketLoader = new GLTFLoader()
  .loadAsync("thrusterRocket.glb")
  .then((gltf) => {
    const model = gltf.scene.getObjectByName("Rocket") as Object3D;
    model.scale.multiplyScalar(ROCKET_SCALE);
    return model;
  });

export class Rocket extends Object3D {
  curve: Curve<Vector3>;
  animation: FrameRequestCallback;
  arrivalTime?: number;

  constructor(ledger: Ledger) {
    super();

    rocketLoader.then((model) => {
      this.add(model.clone());
    });

    const curve = this.generateCurve(ledger.sequence);

    this.curve = curve;
    this.#init(curve);

    this.animation = this.animateArrival;
  }

  #init = (curve: Curve<Vector3>) => {
    const destination = curve.getPointAt(0).multiplyScalar(CURVE_SCALE);
    const directionPoint = curve.getPointAt(0.001).multiplyScalar(CURVE_SCALE);

    const directionVector = directionPoint.clone().sub(destination).normalize();

    const spawnPoint = destination
      .clone()
      .add(directionVector.negate().multiplyScalar(SPAWN_DISTANCE));

    this.position.copy(spawnPoint);
    this.lookAt(destination);
  };

  generateCurve = (i: number) => curves[i % curves.length];

  animateArrival = () => {
    const { curve } = this;

    this.position.add(
      this.getWorldDirection(new Vector3()).multiplyScalar(VELOCITY)
    );

    if (this.position.angleTo(curve.getPointAt(0)) < 0.001) {
      this.animation = this.animateFlight;
    }
  };

  animateFlight = (currentTime: number) => {
    const { curve } = this;

    if (!this.arrivalTime) {
      this.arrivalTime = currentTime;
    }

    // Time since arrival in seconds
    const elapsedTime = (currentTime - this.arrivalTime) / 1000;

    // How long it takes to complete a loop
    const loopTime = curve.getLength() / VELOCITY;

    const arcLength1 = (elapsedTime % loopTime) / loopTime;
    const arcLength2 = ((elapsedTime + 0.1) % loopTime) / loopTime;

    const position = curve.getPointAt(arcLength1).multiplyScalar(CURVE_SCALE);
    const lookAtPosition = curve
      .getPointAt(arcLength2)
      .multiplyScalar(CURVE_SCALE);

    this.position.copy(position);
    this.lookAt(lookAtPosition);
  };

  animateDeparture = () => {
    this.position.add(
      this.getWorldDirection(new Vector3()).multiplyScalar(VELOCITY)
    );
  };

  dispose = () => {
    this.animation = this.animateDeparture;

    setTimeout(() => {
      this.parent?.remove(this);
    }, 1000);
  };
}

const curves = [
  new Curves.GrannyKnot(),
  new Curves.DecoratedTorusKnot4b(),
  new Curves.TrefoilKnot(),
  new Curves.CinquefoilKnot(),
  new Curves.KnotCurve(),
  new Curves.TorusKnot(),
  new Curves.VivianiCurve(),
];
