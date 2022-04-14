export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';
export const DEVELOPPERS = ['cchoad', 'cntsangaa', 'cyleebc'];

//Prefix
export const CHECKMATE_PREFIX = 'https://checkmate.csproject.org:3000/api/v1/';
export const CHECKMATE_LOGIN_PATH = 'auth/login';
export const CHECKMATE_REFRESH_PATH = 'auth/refresh';
export const CHECKMATE_BOOKING_PATH = 'booking';
export const CHECKMATE_CHECKIN_PATH = 'checkin';
export const CHECKMATE_LOCATION_PATH = 'location';
export const CHECKMATE_USER_PATH = 'user';
export const CHECKMATE_LOCATION_BY_NAME_PATH = 'location/findByName';
export const CHECKMATE_USER_BY_FILTER_PATH = 'user/findByFilter';
export const CHECKMATE_TAG_PATH = 'tag';
export const CHECKMATE_USER_TYPE_PATH = 'user-type';
export const CHECKMATE_LOCATION_TYPE_PATH = 'location-type';
export const CHECKMATE_TF_MODEL_PATH = 'https://checkmate.csproject.org:3002/prediction.tflite';

//Error
export const ERROR_REFRESH_ACCESS_TOKEN = 'RefreshAccessTokenError';
export const ERROR_LOGIN_NOT_ADMIN = 'LoginNotAdminError';
export const ERROR_EMAIL_FORMAT = 'Invalid email format.';
export const ERROR_REQUIRED = 'Required.';
export const ERROR_PASSWORD_LENGTH = 'Password length must be at least 8 characters.';
export const ERROR_PASSWORD_NOT_MATCH = 'Passwords didn’t match. Try again.';

//Action
export const ACTION_DELETE = 'DeleteAction';
export const ACTION_EDIT = 'EditAction';

//Text
export const TEXT_DELETE_USER = 'Delete User?';
export const TEXT_DELETE_LOCATION = 'Delete Location?';
export const TEXT_DELETE_TAG = 'Delete Tag?';
export const TEXT_DELETE_BOOKING = 'Delete Booking?';
export const TEXT_DELETE = 'Delete';
export const TEXT_SHOW_AES_KEY = 'Show AES Key';
export const TEXT_VISIBILITY_OFF = 'Visibility off';
export const TEXT_ADD_TAG = 'Add a Tag';

//Select
export const SELECT_USER_TYPE = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'Student',
    label: 'Student',
  },
  {
    value: 'Staff',
    label: 'Staff',
  },
  {
    value: 'Guest',
    label: 'Guest',
  },
];
export const SELECT_DEPARTMENT = [
  {
    value: 'Accounting',
    label: 'Accounting',
  },
  {
    value: 'Chemical and Biological Engineering',
    label: 'Chemical and Biological Engineering',
  },
  {
    value: 'Chemistry',
    label: 'Chemistry',
  },
  {
    value: 'Civil and Environmental Engineering',
    label: 'Civil and Environmental Engineering',
  },
  {
    value: 'Computer Science and Engineering',
    label: 'Computer Science and Engineering',
  },
  {
    value: 'Economics',
    label: 'Economics',
  },
  {
    value: 'Electronic and Computer Engineering',
    label: 'Electronic and Computer Engineering',
  },
  {
    value: 'Finance',
    label: 'Finance',
  },
  {
    value: 'Industrial Engineering and Decision Analytics',
    label: 'Industrial Engineering and Decision Analytics',
  },
  {
    value: 'Information Systems, Business Statistics and Operations Management',
    label: 'Information Systems, Business Statistics and Operations Management',
  },
  {
    value: 'Management',
    label: 'Management',
  },
  {
    value: 'Marketing',
    label: 'Marketing',
  },
  {
    value: 'Mathematics',
    label: 'Mathematics',
  },
  {
    value: 'Mechanical and Aerospace Engineering',
    label: 'Mechanical and Aerospace Engineering',
  },
  {
    value: 'Ocean Science',
    label: 'Ocean Science',
  },
  {
    value: 'Physics',
    label: 'Physics',
  },
  {
    value: 'Environment & Sustainability',
    label: 'Environment & Sustainability',
  },
  {
    value: 'Humanities',
    label: 'Humanities',
  },
  {
    value: 'Integrative Systems and Design',
    label: 'Integrative Systems and Design',
  },
  {
    value: 'Life Science',
    label: 'Life Science',
  },
  {
    value: 'Public Policy',
    label: 'Public PolicyPublic Policy',
  },
  {
    value: 'Social Science',
    label: 'Social Science',
  },
];
