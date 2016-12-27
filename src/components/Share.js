import React from 'react';
import classNames from 'classnames';
import getVisibilityClasses from '../utils/getVisibilityClasses';
import ShareButtons from './ShareButtons';
import FancySeparator from './FancySeparator';

const Share = ({ title, action, actionText, visible, className, isGolden, isSuper }) => (
  <div
    className={classNames({
      'xx-modal': true,
      [getVisibilityClasses(visible)]: true,
      [className]: true
    })}
  >
    <div className="xx-modal__overlay">
      <div
        className={classNames({
          "xx-share-window": true,
          "xx-modal__body": true,
          "xx-share-window--golden": isGolden,
          "xx-share-window--super": isSuper
        })}
      >
        {
          title &&
          <FancySeparator className="xx-share-window__title-wrapper">
            <div className="xx-share-window__title">
              {title}
            </div>
          </FancySeparator>
        }
        <div className="xx-share-window__image" />
        <ShareButtons
          className="xx-share-window__buttons"
        />
        {
          isSuper &&
          <div className="xx-share-window__text">
            Это был последний персонаж, вы собрали их всех!<br />
            Кажется, пришло время заглянуть в галерею
          </div>
        }
        <FancySeparator
          className="xx-share-window__button-wrapper"
        >
          <button
            className="xx-btn xx-btn--big xx-btn--inverted xx-share-window__button"
            onClick={action}
          >
            {actionText}
          </button>
        </FancySeparator>
      </div>
    </div>
  </div>
);

Share.propTypes = {
  action: React.PropTypes.func,
  actionText: React.PropTypes.string,
  visible: React.PropTypes.bool,
  className: React.PropTypes.string
};

Share.defaultProps = {
  className: '',
  visible: false
};

export default Share;
