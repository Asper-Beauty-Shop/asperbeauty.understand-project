/**
 * Sonic Branding â€” Asper Beauty
 * Generates audio cues using the Web Audio API.
 * All sounds are subtle, short, and luxurious.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Soft "compact-click + shimmer" â€” Add to Cart */
export function playAddToCartSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Click: short noise burst
    const clickDur = 0.04;
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + clickDur);
    clickGain.connect(ctx.destination);

    const clickOsc = ctx.createOscillator();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(1800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(800, now + clickDur);
    clickOsc.connect(clickGain);
    clickOsc.start(now);
    clickOsc.stop(now + clickDur);

    // Shimmer: gentle high tone
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0, now + 0.05);
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    shimmerGain.connect(ctx.destination);

    const shimmerOsc = ctx.createOscillator();
    shimmerOsc.type = "sine";
    shimmerOsc.frequency.setValueAtTime(2400, now + 0.05);
    shimmerOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
    shimmerOsc.connect(shimmerGain);
    shimmerOsc.start(now + 0.05);
    shimmerOsc.stop(now + 0.45);
  } catch {
    // Silent fail â€” audio is non-critical
  }
}

/** Two-tone crystal chime â€” Notification / Concierge */
export function playNotificationSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    [0, 0.15].forEach((offset, i) => {
      const freq = i === 0 ? 1100 : 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + offset);
      osc.connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.4);
    });
  } catch {
    // Silent fail
  }
}

/** Rising chord â€” Checkout success */
export function playSuccessSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Rising triad: C5 â†’ E5 â†’ G5
    [523, 659, 784].forEach((freq, i) => {
      const offset = i * 0.12;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.04, now + offset + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.6);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + offset);
      osc.connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.65);
    });
  } catch {
    // Silent fail
  }
}
