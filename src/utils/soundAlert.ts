// Web Audio API Synthesizer for Order Notifications (No external MP3 files needed)
export function playOrderAlertSound(volume: number = 0.6) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // First Tone: A5 (880Hz) -> E6 (1318.51Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15);

    gain1.gain.setValueAtTime(volume, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Second Tone: C6 (1046.5Hz) -> A6 (1760Hz) after 180ms
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.25);

        gain2.gain.setValueAtTime(volume * 0.9, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.5);
      } catch (e) {
        // ignore audio errors
      }
    }, 180);
  } catch (err) {
    console.warn('Audio alert sound notice:', err);
  }
}
