import React from 'react';
import classNames from 'classnames';
import RhombusIcon from './RhombusIcon';
import LeftLineIcon from './LeftLineIcon';
import RightLineIcon from './RightLineIcon';

const FancySeparator = ({className="", children}) => (
  <div className={
    classNames({
      "xx-fancy-separator": true,
      [className]: true
    })}
  >
    <div className="xx-fancy-separator__left">
      <LeftLineIcon />
    </div>
    {
      children
        ?
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className="xx-fancy-separator__left-center">
              <RhombusIcon />
            </div>
            {children}
            <div className="xx-fancy-separator__right-center">
              <RhombusIcon />
            </div>
          </div>
        : (
          <div>
            <RhombusIcon />
          </div>
        )
    }
    <div className="xx-fancy-separator__right">
      <RightLineIcon />
    </div>
  </div>
);

export default FancySeparator;
