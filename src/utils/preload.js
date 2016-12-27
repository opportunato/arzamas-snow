import {Howl} from 'howler'

const preload = (resources) => {
  const totalProgress = resources.length;
  let currentProgress = 0;
  const subscribers = {};

  const updateProgress = () => {
    currentProgress = currentProgress += 1;
    (subscribers['progress'] || []).forEach(callback => callback(currentProgress/totalProgress * 100));
    if (currentProgress === totalProgress) {
      (subscribers['load'] || []).forEach(callback => callback());
    }
  };

  resources.forEach(resource => {
    if (resource.type === 'img') {
      const tag = new Image();
      tag.src = resource.url;
      tag.addEventListener('load', updateProgress);
      tag.addEventListener('error', updateProgress);
    }

    if (resource.type === 'audio') {
      const sound = new Howl({
        src: [resource.url],
        onload: updateProgress,
        onloaderror: updateProgress
      });
    }
  });

  return {
    on: (event, callback) => {
      if (!subscribers[event]) subscribers[event] = [];
      subscribers[event].push(callback);
    }
  }
};

export default preload;
