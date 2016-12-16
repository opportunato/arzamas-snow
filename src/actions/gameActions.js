export const TAKE_PHOTO = 'TAKE_PHOTO';
export const FAIL_PHOTO = 'FAIL_PHOTO';

export const takePhoto = () => ({
  type: TAKE_PHOTO,
  payload: true,
});

export const failPhoto = () => ({
  type: FAIL_PHOTO,
  payload: true,
});
