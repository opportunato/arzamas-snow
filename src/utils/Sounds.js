import {Howl} from 'howler';

const soundsFolder = 'https://cdn-s-static.arzamas.academy/x/338-new-year-jhtUdfkkqdp4is/1241/sounds';

const WINTER_KEY = 'wind_mixdown';
const STEP_KEY = 'step0';
const SIGH_KEY = 'sigh';
const SHUTTER_KEY = 'shutter';
const FIREWORKS_KEY = 'fireworks';
const VICTORY_KEY = 'victory';

const getSoundUrl = (key) => `${soundsFolder}/${key}.mp3`;

export const preloadSounds = [getSoundUrl(WINTER_KEY), getSoundUrl(FIREWORKS_KEY), getSoundUrl(VICTORY_KEY), getSoundUrl(SIGH_KEY), getSoundUrl(SHUTTER_KEY)].map(url => ({ url, type: 'audio' }));

export default class Sounds {
  sounds = {};

  stopSound(key) {
    this.sounds[key].sound.stop();
  }

  playWinter() {
    if (this.sounds[WINTER_KEY]) {
      this.sounds[WINTER_KEY].sound.play();
    } else {
      this.playSound(WINTER_KEY, 0.5, {
        loop: true,
      });
    }
  }

  stopWinter() {
    this.stopSound(WINTER_KEY);
  }

  playStep(stepNumber, stepVolume=1) {
    this.playSound(STEP_KEY + stepNumber, 0.3 + stepVolume * 0.7);
  }

  playSigh() {
    this.playSound(SIGH_KEY);
  }

  playShutter() {
    this.playSound(SHUTTER_KEY, 0.8);
  }

  playFireworks() {
    this.playSound(FIREWORKS_KEY, 1, {loop: true});
  }

  stopFireworks() {
    this.stopSound(FIREWORKS_KEY);
  }

  playVictory() {
    this.playSound(VICTORY_KEY);
  }

  playSound(key, volume=1, options={}) {
    const sound = new Howl({
      src: [getSoundUrl(key)],
      onend: () => { delete this.sounds[name] },
      volume: this.isMute ? 0 : volume,
      autoplay: true,
      ...options
    });

    this.sounds[key] = { sound, volume: volume };
  }

  muteSounds() {
    this.isMute = true;
    Object.keys(this.sounds).forEach(key => this.sounds[key].sound.volume(0));
  }

  unmuteSounds() {
    this.isMute = false;
    Object.keys(this.sounds).forEach(key => {
      this.sounds[key].sound.volume(this.sounds[key].volume);
    });
  }
}
