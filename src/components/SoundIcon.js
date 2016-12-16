import React from 'react';

const SoundIcon = (isOn) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="27"
    height="20"
    viewBox="0 0 27 20"
  >
    {
      isOn
        ? <path fill="#fff" fillRule="evenodd" d="M3473,117h6l6-6v20l-6-6h-6v-8Zm15,1h2v6h-2v-6Zm5-3h2v12h-2V115Zm5-3h2v18h-2V112Z" transform="translate(-3473 -111)"/>
        : <path fill="#fff" fillRule="evenodd" d="M3500.01,125l-2.01,2-4-4-4,4-2.01-2,4.01-4-4.01-4,2.01-2,4,4,4-4,2.01,2-4.01,4ZM3473,125v-8h6l6-6v20l-6-6h-6Z" transform="translate(-3473 -111)"/>
    }

  </svg>
);

export default SoundIcon;
