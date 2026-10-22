export function consumeJumpRequest(requested, grounded) {
  return {
    shouldJump: requested && grounded,
    pending: requested && !grounded,
  };
}
