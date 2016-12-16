import classNames from 'classnames';

const getVisibilityClasses = (visibleCondition) => classNames({
  'xx-hidden': !visibleCondition,
  'xx-visible': visibleCondition
});

export default getVisibilityClasses;
