import React from 'react';
import classNames from 'classnames';
import getVisibilityClasses from '../utils/getVisibilityClasses';
import ShareButtons from './ShareButtons';

const Share = ({ action, actionText, visible, className }) => (
  <div
    className={classNames({
      'xx-share-window': true,
      [getVisibilityClasses(visible)]: true,
      [className]: true
    })}
  >
    <div className="xx-share-window__title">Это успех!</div>
    <div className="xx-share-window__image" />
    <ShareButtons
      className="xx-share-window__buttons"
    />
    <button className="xx-btn xx-btn--big xx-btn--inverted" onClick={action}>
      {actionText}
    </button>
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
