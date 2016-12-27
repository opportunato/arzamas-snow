import React from 'react';
import range from 'lodash.range';
import classNames from 'classnames';
import Rules from '../components/Rules';
import GalleryIcon from '../components/GalleryIcon';
import CrossIcon from '../components/CrossIcon';
import SoundIcon from '../components/SoundIcon';
import Gallery from '../components/Gallery';
import Snow from '../components/Snow';
import Fireworks from '../components/Fireworks';
import Share from '../components/Share';
import FancySeparator from '../components/FancySeparator';
import Sounds, {preloadSounds} from '../utils/Sounds';
import walkers from '../walkers.json';
import getVisibilityClasses from "../utils/getVisibilityClasses";
import preload from '../utils/preload';

const ANIMATIONS_NUMBER = 5;
const FACE_STAY_TIME = 10;
const FACE_POSITIONS = 4;
const WALKER_RATIO = 0.6;

const STAGES_NUMBER = 20;
const MAX_TIME = 20;
const MIN_TIME = 10;

const SIZES = [5, 110];
const LEFTS = [50, 20];
const BOTTOMS = [45, -40];
const LOCAL_STORAGE_KEY = 'WALKERS';
const UNREAD_KEY = 'UNREAD';

const RESOURCE_FOLDER = 'https://cdn-s-static.arzamas.academy/x/338-new-year-jhtUdfkkqdp4is/1241/images';

const getInitialState = () => {
  const metWalkers = localStorage.getItem(LOCAL_STORAGE_KEY) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) : {};
  const unreadNumber = localStorage.getItem(UNREAD_KEY) || 0;
  const isGameFinished = areAllCollected(metWalkers);

  return {
    animationNumber: null,
    walkerStyles: {},
    showPhoto: false,
    showGallery: isGameFinished,
    shareData: null,
    facePosition: 0,
    galleryShareData: null,
    success: false,
    fail: false,
    faceStep: 0,
    showFlash: false,
    isSoundOn: true,
    galleryPulsing: false,
    isLoaded: false,
    progress: 0,
    unreadNumber: +unreadNumber,
    metWalkers,
    showRules: !isGameFinished
  };
};

const getQuadraticFunction = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  const a = (y2-y1)/(x2*x2-x1*x1);
  const c = (y1-a*x1*x1);

  return (x) => {
    return x * x * a + + c;
  };
};

const getTripleFunction = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  const a = (y2-y1)/(x2*x2*x2-x1*x1*x1);
  const c = (y1-a*x1*x1*x1);

  return (x) => {
    return x * x * x * a + + c;
  };
};

const resetStages = (stagesNumber) => {
  const sizeFunction = getTripleFunction({x: 1, y: SIZES[0]}, {x: STAGES_NUMBER, y: SIZES[1]});
  const leftFunction = getQuadraticFunction({x: 1, y: LEFTS[0]}, {x: STAGES_NUMBER, y: LEFTS[1]});
  const bottomFunction = getQuadraticFunction({x: 1, y: BOTTOMS[0]}, {x: STAGES_NUMBER, y: BOTTOMS[1]});

  return range(stagesNumber).map(number => ({
    height: (sizeFunction(number + 1)) + '%',
    width: (sizeFunction(number + 1)) * WALKER_RATIO + '%',
    left: (leftFunction(number + 1)) + '%',
    bottom: (bottomFunction(number + 1)) + '%'
  }));
};

const resetWalker = (metWalkers) => {
  const notMetWalkers = walkers.filter((walker) => Object.keys(metWalkers).indexOf(walker.id) === -1);
  return notMetWalkers[Math.floor(Math.random() * notMetWalkers.length)] || {};
};

export const areAllCollected = (metWalkers) => {
  return Object.keys(metWalkers).filter(key => walkers.find(walker => walker.id === key)).length === walkers.length;
};

class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ...getInitialState()
    };
    this.sounds = new Sounds();
    this.resetParams(this.state.metWalkers);
    if (areAllCollected(this.state.metWalkers)) {
      this.sounds.playFireworks();
    }
  }



  componentDidMount() {
    const preloadSubscriber = preload(preloadSounds);
    preloadSubscriber.on('progress', (progress) => this.setState({progress}));
    preloadSubscriber.on('load', () => this.setState({isLoaded: true}));
  }

  componentDidUpdate(prevProps, prevState) {
    if (Object.keys(prevState.metWalkers).length !== Object.keys(this.state.metWalkers).length) {
      this.saveWalkers(this.state.metWalkers);
    }
    if (prevState.unreadNumber !== this.state.unreadNumber) {
      this.saveUnreadNumber(this.state.unreadNumber);
    }

    if (prevState.isSoundOn !== this.state.isSoundOn) {
      if (this.state.isSoundOn) {
        this.sounds.unmuteSounds();
      } else {
        this.sounds.muteSounds();
      }
    }

    if (areAllCollected(prevState.metWalkers) !== areAllCollected(this.state.metWalkers)) {
      if (areAllCollected(this.state.metWalkers)) {
        this.sounds.playFireworks();
      } else {
        this.sounds.stopFireworks();
      }
    }
  }

  resetParams(metWalkers) {
    this.totalTime = Math.floor(Math.random() * (MAX_TIME - MIN_TIME)) + MIN_TIME;
    this.animationTime = this.totalTime/STAGES_NUMBER;
    this.stages = resetStages(STAGES_NUMBER);
    this.walker = resetWalker(metWalkers);
  }

  setWalkTimer = () => {
    const stage = this.stages[0];
    this.stages = this.stages.slice(1);

    if (Object.keys(this.state.walkerStyles).length === 0) {
      this.setState({
        walkerStyles: range(ANIMATIONS_NUMBER).reduce((memo, index) => {
          memo[index] = this.stages[index];
          return memo;
        }, {})
      });
    }

    setTimeout(() => {
      const {animationNumber, walkerStyles} = this.state;
      const newAnimationNumber = (animationNumber + 1) % ANIMATIONS_NUMBER;
      this.setState({
        walkerStyles: {
          ...walkerStyles,
          [newAnimationNumber]: stage
        },
        animationNumber: newAnimationNumber,
        showPhoto: this.stages.length === 0
      });
      this.sounds.playStep(newAnimationNumber + 1, parseInt(stage.height)/SIZES[1]);
      if (this.stages.length > 0) {
        this.setWalkTimer();
      } else {
        this.setFaceTimer();
      }
    }, this.animationTime * 1000);
  };

  setFaceTimer = () => {
    this.faceTimer = setTimeout(() => {
      this.sounds.playSigh();
      this.faceTimer = setTimeout(() => {
        this.timeFace();
      }, 4000);
    }, (FACE_STAY_TIME - 4) * 1000);
  };

  timeFace = () => {
    if (this.state.facePosition === FACE_POSITIONS) {
      this.fail();
      return;
    } else {
      this.sounds.playStep(this.state.facePosition + 1);
      this.setState({facePosition: this.state.facePosition + 1});
    }
    this.faceTimer = setTimeout(() => {
      this.timeFace();
    }, 4000);
  };

  fail = () => {
    this.setState({
      fail: true,
      showPhoto: false,
      shareData: {
        title: "Это провал",
        walker: this.walker,
        time: 10,
        action: this.restart,
        actionText: 'Попробуй еще раз'
      }
    });
  };

  takePhoto = () => {
    clearTimeout(this.faceTimer);
    const metWalkers = {
      ...this.state.metWalkers,
      [this.walker.id]: true
    };
    const isSuper = areAllCollected(metWalkers) && !areAllCollected(this.state.metWalkers);
    this.setState({showFlash: true, metWalkers, unreadNumber: this.state.unreadNumber + 1});
    this.sounds.playShutter();
    if (isSuper) {}
    setTimeout(() => {
      if (isSuper) {
        this.sounds.playVictory();
      }
      this.setState({
        showFlash: false,
        success: true,
        galleryPulsing: true,
        showPhoto: false,
        shareData: {
          title: isSuper ? "Это фантастический успех" : "Это успех",
          isSuper,
          walker: this.walker,
          time: 10,
          action: isSuper ? this.toggleGallery : this.restart,
          actionText: isSuper ? "Ты их всех собрал" : "Собери их всех",
        }
      })
    }, 100);
  };

  clearResults = () => {
    this.setState({ metWalkers: {} });
    setTimeout(() => {
      this.restart();
    }, 50);
  };

  shareGallery = (walker) => {
    this.setState({
      galleryShareData: {
        walker: walker,
        time: 10,
        action: () => this.setState({ galleryShareData: null }),
        actionText: 'ОК'
      }
    });
  };

  shareGolden = () => {
    this.setState({
      galleryShareData: {
        isGolden: true,
        title: "Золотой шэр!",
        action: () => this.setState({ galleryShareData: null }),
        actionText: 'ОК'
      }
    });
  };

  startGame = () => {
    this.setState({ showRules: false });
    this.setWalkTimer();
    this.sounds.playWinter();
  };

  restart = () => {
    this.resetParams(this.state.metWalkers);
    this.setState({
      ...getInitialState(),
      showRules: false
    });
    this.setWalkTimer();
  };

  toggleGallery = () => {
    this.setState({
      showGallery: !this.state.showGallery,
      galleryPulsing: false,
      unreadNumber: 0,
      shareData: areAllCollected(this.state.metWalkers) ? null : this.state.shareData
    });
  };

  saveWalkers = (metWalkers) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(metWalkers));
  };

  saveUnreadNumber = (unreadNumber) => {
    localStorage.setItem(UNREAD_KEY, unreadNumber);
  };

  render() {
    const {
      animationNumber,
      walkerStyles,
      showPhoto,
      showRules,
      showGallery,
      facePosition,
      shareData,
      galleryShareData,
      showFlash,
      success,
      isSoundOn,
      galleryPulsing,
      metWalkers,
      unreadNumber,
      progress,
      isLoaded
    } = this.state;
    const isGameFinished = areAllCollected(metWalkers);

    return (
      <div
        className={classNames({
          'xx-field': true,
          'xx-field-photo': true
        })}
      >
        <div className="xx-stars" />
        <div className="xx-forest" />
        <div className="xx-overlay" />
        <Snow />
        {
          isGameFinished && <Fireworks />
        }
        <div className="xx-moon" />
        <div
          className={classNames({
              "xx-flash": true,
              "xx-flash--fade-out": success,
              [getVisibilityClasses(showFlash)]: true
          })}
        />
        <ul
          className={classNames({
            "xx-buttons": true,
            [getVisibilityClasses(!showRules)]: true
          })}
        >
          <li className="xx-buttons__item">
            <button
              className="xx-btn-unstyled xx-btn-icon"
              onClick={() => this.setState({isSoundOn: !isSoundOn}) }
            >
              <SoundIcon isOn={isSoundOn} />
            </button>
          </li>
          <li className="xx-buttons__item">
            <button
              className={classNames({
                "xx-btn-unstyled xx-btn-icon": true,
                "xx-btn-icon--pulsing": galleryPulsing,
                "xx-btn-icon--golden": isGameFinished
              })}
              onClick={this.toggleGallery}
            >
              {
                showGallery
                  ? <CrossIcon />
                  : <GalleryIcon />
              }
              {
                unreadNumber > 0 &&
                <span className="xx-btn-icon__counter">
                  {unreadNumber}
                </span>
              }
            </button>
          </li>
        </ul>
        <Share
          className = "xx-modal--share"
          visible = {shareData !== null}
          {...shareData}
        />
        <Gallery
          visible = {showGallery}
          share = {this.shareGallery}
          shareGolden = {this.shareGolden}
          clearResults = {this.clearResults}
          metWalkers = {metWalkers}
        />
        <Share
          visible = {galleryShareData !== null}
          className = "xx-modal--gallery-share"
          {...galleryShareData}
        />
        <Rules
          onClick = {this.startGame}
          visible = {showRules}
          isLoaded = {isLoaded}
          progress = {progress}
        />
        {
          range(ANIMATIONS_NUMBER).map(number =>
            <div
              key={number}
              className={
                classNames({
                  'xx-walker': true,
                  [`xx-walker--animation-${number}`]: true,
                  [getVisibilityClasses(animationNumber === number && this.stages.length > 0)]: true
                })
              }
              style={walkerStyles[number]}
            />
          )
        }
        {
          <div
            className={
              classNames({
                'xx-face': true,
                [`xx-face--position-${facePosition}`]: true,
                "xx-face--animated": !success,
                [getVisibilityClasses(showPhoto)]: true
              })
            }
          >
            {
              this.walker.id &&
              <img src={`${RESOURCE_FOLDER}/walkers/${this.walker.id}.png`} />
            }
          </div>
        }
        {
          <div
            className={classNames({
              'xx-photo': true,
              [`xx-photo--animated`]: !success,
              [getVisibilityClasses(showPhoto)]: true
            })}
          >
            <div className="xx-photo__wrapper">
              <h2 className="xx-photo__title">
                Привет!<br/>
                Вот мы и встретились, я —<br/>
                <strong className="xx-photo__title--strong">
                  {this.walker.name}
                </strong>
              </h2>
              <FancySeparator className="xx-photo__separator" />
              <button
                className="xx-btn xx-photo__button"
                onClick={this.takePhoto}
              >
                Быстро, делаем фотулю!
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Game;
