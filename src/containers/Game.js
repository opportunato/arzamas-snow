import React from 'react';
import range from 'lodash.range';
import classNames from 'classnames';
import Rules from '../components/Rules';
import GalleryIcon from '../components/GalleryIcon';
import CrossIcon from '../components/CrossIcon';
import SoundIcon from '../components/SoundIcon';
import Gallery from '../components/Gallery';
import Snow from '../components/Snow';
import Share from '../components/Share';
import FancySeparator from '../components/FancySeparator';
import walkers from '../walkers.json';
import getVisibilityClasses from "../utils/getVisibilityClasses";

const MAX_TIMER_LENGTH = 3;
const STAGES_NUMBER = 5;
const FACE_STAY_TIME = 10;
const FACE_POSITIONS = 4;

const WALKERS = 'WALKERS';

const getInitialState = () => ({
  stageNumber: 0,
  walkerLefts: range(STAGES_NUMBER).reduce((memo, stage) => {
    memo[stage + 1] = getWalkerLeft(stage + 1);
    return memo;
  }, {}),
  showPhoto: false,
  showGallery: false,
  shareData: null,
  facePosition: 0,
  galleryShareData: null,
  success: false,
  fail: false,
  faceStep: 0,
  showFlash: false
});

const resetTimers = () => range(STAGES_NUMBER).map(() =>
  Math.ceil(Math.random() * MAX_TIMER_LENGTH) * 1000
);

const resetWalker = () =>
  walkers[Math.floor(Math.random() * walkers.length)];

const walkerLefts = {
  1: [49, 54],
  2: [43, 49],
  3: [38, 43],
  4: [30, 38]
};

const getWalkerLeft = (stage) => {
  const lefts = walkerLefts[stage];
  if (!lefts) return null;
  const interval = lefts[1] - lefts[0];
  const min = lefts[0];
  return min + Math.floor(Math.random() * interval);
};

export const isGolden = (metWalkers) => {
  return Object.keys(metWalkers).length === walkers.length;
};

class Game extends React.Component {

  state = {
    ...getInitialState(),
    showRules: false,
    metWalkers: localStorage.getItem(WALKERS) ? JSON.parse(localStorage.getItem(WALKERS)) : {}
  };

  timers = resetTimers();
  walker = resetWalker();

  componentDidMount() {
    // this.setWalkTimer();
  }

  setWalkTimer = () => {
    const timer = this.timers[0];
    this.timers = this.timers.slice(1);
    setTimeout(() => {
      const {stageNumber} = this.state;
      const newStageNumber = stageNumber + 1;
      this.setState({
        stageNumber: newStageNumber,
        showPhoto: this.timers.length === 0
      });
      if (this.timers.length > 0) {
        this.setWalkTimer();
      } else {
        this.setFaceTimer();
      }
    }, timer);
  };

  setFaceTimer = () => {
    this.faceTimer = setTimeout(() => {
      this.timeFace();
    }, FACE_STAY_TIME * 1000);
  };

  timeFace = () => {
    if (this.state.facePosition === FACE_POSITIONS) {
      this.fail();
      return;
    } else {
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
    const isSuper = isGolden(metWalkers) && !isGolden(this.state.metWalkers);
    this.setState({
      showFlash: true,
      metWalkers
    });
    this.saveWalkers(metWalkers);
    setTimeout(() => {
      this.setState({
        showFlash: false,
        success: true,
        showPhoto: false,
        shareData: {
          title: isSuper ? "Это фантастический успех" : "Это успех",
          walker: this.walker,
          time: 10,
          action: this.restart,
          actionText: isSuper ? "Ты их всех собрал" : "Собери их всех",
        }
      })
    }, 100);
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

  startGame = () => {
    this.setState({ showRules: false });
    this.setWalkTimer();
  };

  restart = () => {
    this.timers = resetTimers();
    this.walker = resetWalker();
    this.setState({
      ...getInitialState()
    });
    this.setWalkTimer();
  };

  toggleGallery = () => {
    this.setState({
      showGallery: !this.state.showGallery
    });
  };

  saveWalkers = (metWalkers) => {
    localStorage.setItem(WALKERS, JSON.stringify(metWalkers));
  };

  render() {
    const {
      stageNumber,
      showPhoto,
      showRules,
      showGallery,
      facePosition,
      shareData,
      galleryShareData,
      showFlash,
      success,
      metWalkers,
      walkerLefts
    } = this.state;

    return (
      <div
        className={classNames({
          'xx-field': true,
          'xx-field-photo': true
        })}
      >
        <div className="xx-placeholder" />
        <div className="xx-stars" />
        <div className="xx-forest" />
        <div className="xx-overlay" />
        <Snow />
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
              onClick={this.toggleGallery}
            >
              <SoundIcon isOn={true} />
            </button>
          </li>
          <li className="xx-buttons__item">
            <button
              className="xx-btn-unstyled xx-btn-icon"
              onClick={this.toggleGallery}
            >
              {
                showGallery
                  ? <CrossIcon />
                  : <GalleryIcon />
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
        />
        {
          range(STAGES_NUMBER).map(number =>
            <div
              key={number}
              className={
                classNames({
                  'xx-walker': true,
                  [`xx-walker--stage-${number}`]: true,
                  [getVisibilityClasses(stageNumber === number)]: true
                })
              }
              style={{
                left: walkerLefts[number] + '%'
              }}
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
            <img src="https://s3.eu-central-1.amazonaws.com/arzamas-static/x/338-new-year-jhtUdfkkqdp4is/1241/images/walkers/tolstoi.png" />
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
