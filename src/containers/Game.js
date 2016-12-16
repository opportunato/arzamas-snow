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
import walkers from '../walkers.json';
import getVisibilityClasses from "../utils/getVisibilityClasses";

const MAX_TIMER_LENGTH = 3;
const STAGES_NUMBER = 5;
const FACE_STAY_TIME = 10;

const getInitialState = () => ({
  stageNumber: 0,
  showPhoto: true,
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

class Game extends React.Component {

  state = {
    ...getInitialState(),
    showRules: false
  };

  timers = resetTimers();
  walker = resetWalker();

  setWalkTimer = () => {
    const timer = this.timers[0];
    this.timers = this.timers.slice(1);
    setTimeout(() => {
      const {stageNumber} = this.state;
      this.setState({
        stageNumber: stageNumber + 1,
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
    setTimeout(() => {
      this.setState({
        facePosition: 1,
        fail: true,
        showPhoto: false,
        shareData: {
          walker: this.walker,
          time: 10,
          action: this.restart,
          actionText: 'Собери их все'
        }
      })
    }, FACE_STAY_TIME * 1000);
  };

  takePhoto = () => {
    this.setState({
      showFlash: true
    });
    setTimeout(() => {
      this.setState({
        showFlash: false,
        success: true,
        showPhoto: false,
        shareData: {
          walker: this.walker,
          time: 10,
          action: this.restart,
          actionText: 'Собери их все'
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
    // this.setWalkTimer();
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
      success
    } = this.state;

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
          visible = {shareData !== null}
          {...shareData}
        />
        <Gallery
          visible = {showGallery}
          share = {this.shareGallery}
        />
        <Share
          visible = {galleryShareData !== null}
          className = "xx-share--gallery"
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
          />
        }
        {
          <div
            className={classNames({
              'xx-photo': true,
              [`xx-photo--animated`]: !success,
              [getVisibilityClasses(showPhoto)]: true
            })}
          >
            <h2 className="xx-photo__title">
              Привет!<br/>
              Вот мы и встретились, я —<br/>
              <strong className="xx-photo__title--strong">
                {this.walker.name}
              </strong>
            </h2>
            <button
              className="xx-btn"
              onClick={this.takePhoto}
            >
              Быстро, делаем фотулю!
            </button>
          </div>
        }
      </div>
    );
  }
}

export default Game;
