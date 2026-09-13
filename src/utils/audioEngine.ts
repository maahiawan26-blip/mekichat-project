// Web Audio API synthesizer for realistic stem playback and sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private activeNodes: (OscillatorNode | GainNode)[] = [];
  private currentTrackId: string | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play short melodic or UI notification beep
  public playClick(freq = 440, duration = 0.08, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Play stem synth snippet with musical arpeggio
  public playStemSnippet(
    trackId: string,
    onProgress?: (progress: number) => void,
    onEnd?: () => void
  ) {
    try {
      this.stop();
      this.initCtx();
      if (!this.ctx) return;

      this.isPlaying = true;
      this.currentTrackId = trackId;

      const notes = [
        349.23, // F4
        415.3, // G#4 / Ab4
        523.25, // C5
        622.25, // Eb5
        698.46, // F5
        622.25,
        523.25,
        415.3,
      ];
      let noteIndex = 0;
      let step = 0;
      const totalSteps = 64; // ~15 seconds loop

      this.timerId = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const now = this.ctx.currentTime;

        // Sub Bass kick pulse on step % 4 === 0
        if (step % 4 === 0) {
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(110, now);
          subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.2);
          subGain.gain.setValueAtTime(0.3, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          subOsc.connect(subGain);
          subGain.connect(this.ctx.destination);
          subOsc.start(now);
          subOsc.stop(now + 0.25);
        }

        // Melodic synth note
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = trackId.includes('bass') ? 'sawtooth' : 'triangle';
        const freq = notes[noteIndex % notes.length];
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);

        noteIndex++;
        step++;

        if (onProgress) {
          onProgress((step / totalSteps) * 100);
        }

        if (step >= totalSteps) {
          this.stop();
          if (onEnd) onEnd();
        }
      }, 238); // ~126 BPM sixteenth note pulse
    } catch {
      // Audio context might be restricted
    }
  }

  // Play stem mixer stems with active channel weights
  public playMixerSession(
    activeStems: { drums: boolean; subbass: boolean; juno: boolean; vocals: boolean },
    onTick?: (beat: number) => void
  ) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;
    this.isPlaying = true;
    let beat = 0;

    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;

      // Drums: Kick on beat 0, 2; Snare on beat 1, 3; Hihat on every beat
      if (activeStems.drums) {
        // Hihat
        const hhOsc = this.ctx.createOscillator();
        const hhGain = this.ctx.createGain();
        hhOsc.type = 'square';
        hhOsc.frequency.setValueAtTime(8000, now);
        hhGain.gain.setValueAtTime(0.04, now);
        hhGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        hhOsc.connect(hhGain);
        hhGain.connect(this.ctx.destination);
        hhOsc.start(now);
        hhOsc.stop(now + 0.05);

        // Kick
        if (beat % 2 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.frequency.setValueAtTime(130, now);
          kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
          kickGain.gain.setValueAtTime(0.35, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          kickOsc.connect(kickGain);
          kickGain.connect(this.ctx.destination);
          kickOsc.start(now);
          kickOsc.stop(now + 0.2);
        }
      }

      // Sub Bass
      if (activeStems.subbass && (beat % 2 === 0 || beat % 4 === 3)) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(55, now); // A1 note
        bassGain.gain.setValueAtTime(0.2, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.35);
      }

      // Juno-106 Synth
      if (activeStems.juno) {
        const junoOsc = this.ctx.createOscillator();
        const junoGain = this.ctx.createGain();
        const junoFilter = this.ctx.createBiquadFilter();
        junoOsc.type = 'sawtooth';
        const chordNotes = [277.18, 369.99, 440, 554.37]; // F#m7 chords
        const note = chordNotes[beat % chordNotes.length];
        junoOsc.frequency.setValueAtTime(note, now);
        junoFilter.type = 'lowpass';
        junoFilter.frequency.setValueAtTime(2200, now);
        junoFilter.Q.setValueAtTime(4, now);
        junoGain.gain.setValueAtTime(0.16, now);
        junoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        junoOsc.connect(junoFilter);
        junoFilter.connect(junoGain);
        junoGain.connect(this.ctx.destination);
        junoOsc.start(now);
        junoOsc.stop(now + 0.3);
      }

      // Vocals pad tone
      if (activeStems.vocals && beat % 4 === 0) {
        const vocOsc = this.ctx.createOscillator();
        const vocGain = this.ctx.createGain();
        vocOsc.type = 'sine';
        vocOsc.frequency.setValueAtTime(554.37, now); // C#5
        vocGain.gain.setValueAtTime(0.08, now);
        vocGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        vocOsc.connect(vocGain);
        vocGain.connect(this.ctx.destination);
        vocOsc.start(now);
        vocOsc.stop(now + 0.8);
      }

      beat++;
      if (onTick) onTick(beat);
    }, 238);
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.activeNodes.forEach((n) => {
      try {
        if ('stop' in n) (n as OscillatorNode).stop();
        n.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getPlayingTrackId(): string | null {
    return this.currentTrackId;
  }
}

export const soundEngine = new SoundEngine();
