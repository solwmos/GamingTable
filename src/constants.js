export const CATEGORIES = ['Strategy', 'Family', 'Cooperative', 'Party', 'Abstract'];

export const REGISTRATION_FORM_INITIAL_STATE = {
  name: '',
  email: '',
  age: '',
  gender: '',
  preferences: []
};

export const CREATE_TABLE_FORM_INITIAL_STATE = {
  title: '',
  numPlayers: 4,
  place: 'Indoor',
  dateTime: '',
  boardGames: []
};

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

export const PLACE_OPTIONS = [
  { value: 'Indoor', label: 'Indoor' },
  { value: 'Outdoor', label: 'Outdoor' }
];
