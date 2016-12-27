import React from 'react';
import classNames from 'classnames';
import CheckIcon from './CheckIcon';
import walkers from '../walkers.json';
import FancySeparator from './FancySeparator';
import {areAllCollected} from '../containers/Game';

class Gallery extends React.Component {
  render() {
    const {visible, share, metWalkers, shareGolden, clearResults} = this.props;
    const golden = areAllCollected(metWalkers);

    return (
      <div className={classNames({
        'xx-modal': true,
        'xx-modal--gallery': true,
        'xx-modal--hidden': !visible
      })}>
        <div className="xx-modal__overlay">
          <div className={classNames({
            'xx-gallery': true,
            'xx-modal__body': true,
            "xx-gallery--golden": golden
          })}>
            <div className="xx-gallery__count">
              {Object.keys(metWalkers).filter(key => walkers.find(walker => walker.id === key)).length}/{walkers.length}
            </div>
            {
              golden &&
              <FancySeparator
                className="xx-gallery__golden-share-wrapper"
              >
                <button
                  className="xx-btn xx-btn--big xx-gallery__golden-share"
                  onClick={shareGolden}
                >
                  Золотой шар
                </button>
              </FancySeparator>
            }
            {
              golden &&
              <button
                className="xx-btn-unstyled xx-gallery__clear"
                onClick={clearResults}
              >
                Сбросить все результаты
              </button>
            }
            <ul className="xx-gallery__container">
              {
                walkers.map((walker, index) => {
                  const isOpened = Object.keys(metWalkers).find(item => item === walker.id);
                  const Tag = isOpened ? "button" : "div";

                  return (
                    <li
                      className="xx-gallery__item"
                      key={index}
                    >
                      <Tag
                        key={index}
                        className={
                          classNames({
                            "xx-gallery-walker": true,
                            "xx-btn-unstyled": isOpened,
                            "xx-gallery-walker--golden": golden,
                            "xx-gallery-walker--opened": isOpened
                          })
                        }
                        onClick={isOpened ? share.bind(walker) : null}
                      >
                        <div className="xx-gallery-walker__frame">
                          <div
                            className={
                              classNames({
                                "xx-gallery-walker__portrait": true,
                                "xx-gallery-walker__portrait--opened": isOpened
                              })
                            }
                            style={{
                              backgroundImage: isOpened ? `url(https://cdn-s-static.arzamas.academy/x/338-new-year-jhtUdfkkqdp4is/1241/images/walkers/${walker.id}.png)` : null
                            }}
                          >
                            {
                              isOpened &&
                              <div className="xx-gallery-walker__check">
                                <CheckIcon />
                              </div>
                            }
                          </div>
                        </div>
                        {
                          isOpened &&
                          <div className="xx-gallery-walker__name">
                            {walker.name}
                          </div>
                        }
                      </Tag>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
