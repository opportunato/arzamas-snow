import React from 'react';
import classNames from 'classnames';
import getVisibilityClasses from '../utils/getVisibilityClasses';

const Share = ({ action, actionText, visible, className }) => (
  <div
    className={classNames({
      'xx-share': true,
      [getVisibilityClasses(visible)]: true,
      [className]: true
    })}
  >
    <button className="xx-btn xx-btn--big" onClick={action}>
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
