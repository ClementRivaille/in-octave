import Tone from 'tone';

class Instrument {
  constructor() {
    const promises = [];
    this.instruments = {};
    promises.push(
      new Promise(resolve => {
        const pianoReverb = new Tone.Reverb({
          decay: 6,
          wet: 0.4
        }).toMaster();
        this.instruments.piano = new Tone.Sampler(
          {
            A3: 'A3v7.wav',
            A4: 'A4v7.wav',
            C3: 'C3v7.wav',
            C4: 'C4v7.wav',
            'D#3': 'Ds3v7.wav',
            'F#3': 'Fs3v7.wav'
          },
          {
            release: 1,
            baseUrl: './resources/piano/',
            onload: resolve,
            volume: 1
          }
        ).connect(pianoReverb);
        pianoReverb.generate();
      })
    );

    promises.push(
      new Promise(resolve => {
        const xylophoneReverb = new Tone.Reverb({
          decay: 2,
          wet: 0.2
        }).toMaster();
        this.instruments.xylophone = new Tone.Sampler(
          {
            G3: 'B15.wav',
            A3: 'B17.wav',
            C3: 'B20.wav',
            E3: 'B24.wav',
            G4: 'B27.wav'
          },
          {
            release: 0.5,
            baseUrl: './resources/xylophone/',
            onload: resolve,
            volume: -10
          }
        ).connect(
          new Tone.FeedbackDelay({
            delayTime: 0.1,
            feedback: 0.3,
            wet: 0.5
          }).connect(xylophoneReverb)
        );
        xylophoneReverb.generate();
      })
    );

    promises.push(
      new Promise(resolve => {
        const guitarReverb = new Tone.Reverb({
          decay: 7,
          wet: 0.6
        }).toMaster();
        this.instruments.guitar = new Tone.Sampler(
          {
            A3: 'A2.wav',
            A4: 'A3.wav',
            B3: 'B2.wav',
            B4: 'B3.wav',
            C3: 'C2.wav',
            C4: 'C3.wav',
            D3: 'D2.wav',
            D4: 'D3.wav',
            E3: 'E2.wav',
            E4: 'E3.wav',
            F3: 'F2.wav',
            F4: 'F3.wav',
            G3: 'G2.wav',
            G4: 'G3.wav'
          },
          {
            release: 2.5,
            baseUrl: './resources/guitar/',
            onload: resolve,
            volume: -5
          }
        ).connect(guitarReverb);
        guitarReverb.generate();
      })
    );

    this.loading = Promise.all(promises);
  }

  load() {
    return this.loading;
  }

  play(note, instrument) {
    this.instruments[instrument].triggerAttackRelease(note, 0.4);
  }
}

export default Instrument;
