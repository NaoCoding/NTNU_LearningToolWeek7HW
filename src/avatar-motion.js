export function getAvatarMotion(elapsedSeconds, moving, running, grounded, lookY = 0) {
  const phase = elapsedSeconds * (running ? 12 : 8);
  const gait = moving && grounded ? Math.sin(phase) : 0;
  const handGait = moving ? Math.sin(phase) : 0;
  return {
    leftArmX: -gait * 0.48,
    rightArmX: gait * 0.48,
    leftLegX: gait * 0.62,
    rightLegX: -gait * 0.62,
    handX: handGait * 0.035,
    handY: moving ? (Math.abs(Math.cos(phase)) - 0.5) * 0.055 : 0,
    handRotationZ: handGait * 0.08,
    headPitch: Math.asin(Math.max(-1, Math.min(1, lookY))),
  };
}

export function getThirdPersonCameraPose(eyePosition, lookDirection, distance = 4.5, verticalOffset = 0.8) {
  const length = Math.hypot(lookDirection.x, lookDirection.y, lookDirection.z) || 1;
  const direction = {
    x: lookDirection.x / length,
    y: lookDirection.y / length,
    z: lookDirection.z / length,
  };
  return {
    position: {
      x: eyePosition.x - direction.x * distance,
      y: eyePosition.y - direction.y * distance + verticalOffset,
      z: eyePosition.z - direction.z * distance,
    },
    target: {
      x: eyePosition.x + direction.x,
      y: eyePosition.y + direction.y + verticalOffset,
      z: eyePosition.z + direction.z,
    },
  };
}
