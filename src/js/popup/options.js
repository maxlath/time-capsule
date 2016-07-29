module.exports = {
  hours: {
    letter: 'H',
    options: [ 1, 2, 3, 6, 12, 18 ],
    daysFactor: 1/24
  },
  days: {
    letter: 'D',
    options: [ 1, 2, 3, 4, 6, 9 ],
    daysFactor: 1
  },
  weeks: {
    letter: 'W',
    options: [ 1, 2, 3, 6, 10, 25 ],
    daysFactor: 7
  },
  months: {
    letter: 'M',
    options: [ 1, 2, 3, 4, 6, 9 ],
    daysFactor: 356.25/12
  },
  years: {
    letter: 'Y',
    options: [ 1, 2, 3, 4, 5, 10],
    daysFactor: 356.25
  }
}