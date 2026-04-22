export const busRoutes = [
  {
    id: 'r46a', route: '46A', destination: 'Dún Laoghaire', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['O\'Connell St', 'Nassau St', 'Donnybrook', 'Stillorgan', 'Dún Laoghaire'],
    frequency: 12,
  },
  {
    id: 'r7', route: '7', destination: 'Bride\'s Glen', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['O\'Connell St', 'College Green', 'Donnybrook', 'UCD', 'Bride\'s Glen'],
    frequency: 15,
  },
  {
    id: 'r39a', route: '39A', destination: 'UCD Belfield', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['Burlington Rd', 'Donnybrook', 'Stillorgan Rd', 'UCD'],
    frequency: 20,
  },
  {
    id: 'r145', route: '145', destination: 'Heuston Station', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['Tallaght', 'Rathfarnham', 'Rathmines', 'Heuston'],
    frequency: 18,
  },
  {
    id: 'r13', route: '13', destination: 'Harristown', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['O\'Connell St', 'Drumcondra', 'Whitehall', 'Harristown'],
    frequency: 10,
  },
  {
    id: 'luas-green', route: 'Green', destination: 'Brides Glen', operator: 'LUAS',
    color: '#009A44', stops: ['St. Stephen\'s Green', 'Charlemont', 'Ranelagh', 'Milltown', 'Brides Glen'],
    frequency: 8,
  },
  {
    id: 'luas-red', route: 'Red', destination: 'The Point', operator: 'LUAS',
    color: '#E2231A', stops: ['Connolly', 'Busáras', 'Abbey St', 'The Point'],
    frequency: 10,
  },
  {
    id: 'r1', route: '1', destination: 'Santry', operator: 'Dublin Bus',
    color: '#003DA5', stops: ['O\'Connell St', 'Parnell Sq', 'Drumcondra', 'Santry'],
    frequency: 15,
  },
]

export const nearbyStops = [
  { id: 's001', name: 'O\'Connell St (Stop 1)', distance: '80m', routes: ['1', '7', '13', '39A', '46A'] },
  { id: 's002', name: 'College Green', distance: '230m', routes: ['7', '39A', '46A', 'Green'] },
  { id: 's003', name: 'Nassau St', distance: '350m', routes: ['46A', '7', '145'] },
  { id: 's004', name: 'Hawkins St', distance: '410m', routes: ['1', '13', 'Red'] },
]

export const popularRoutes = [
  { id: 'pr1', from: 'O\'Connell St', to: 'UCD Belfield', route: '39A', duration: '28 min', changes: 0 },
  { id: 'pr2', from: 'Heuston', to: 'St. Stephen\'s Green', route: 'Red → Green', duration: '22 min', changes: 1 },
  { id: 'pr3', from: 'Rathmines', to: 'City Centre', route: '14 / 83', duration: '18 min', changes: 0 },
]
