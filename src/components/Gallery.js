import React from 'react';
import classNames from 'classnames';
import walkers from '../walkers.json';

class Gallery extends React.Component {
  render() {
    const {visible, share} = this.props;

    return (
      <div className={classNames({
        'xx-gallery': true,
        'xx-gallery--hidden': !visible
      })}>
        <div className="xx-gallery__container">
          {
            walkers.map((walker, index) =>
              <li className="xx-gallery__item">
                <div
                  key={index}
                  className="xx-gallery__walker"
                  onClick={share.bind(walker)}
                />
              </li>
            )
          }
        </div>
      </div>
    );
  }
}

export default Gallery;
