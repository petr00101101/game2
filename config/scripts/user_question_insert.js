db.user.insertMany([
  { _id: ObjectId('5dc72349d5aa81af5650f0e5'),
    name: 'Sarah S.',
    avatarURL: "cat1.png",
    answers: {
      "5dc720dc0f051afb6fd6db41": 'optionOne',
      "5dc721d182ef37213dfbe9aa": 'optionTwo',
      "5dc7220e82ef37213dfbe9ab": 'optionTwo',
      "5dc72255d5aa81af5650f0e2": 'optionTwo'
    },
    questions: ['5dc720dc0f051afb6fd6db41', '5dc7220e82ef37213dfbe9ab'],
    username: 'sarahs',
    password: '$2b$08$DKGVbqSoJdwqHIJldRoFYuDcklh9VwTvvars49iALPAHUj0eCGsRG',
    isDisabled: false,
  },
  {
    _id: ObjectId('5dc72349d5aa81af5650f0e6'),
    name: 'Tyler T.',
    avatarURL: "cat2.png",
    answers: {
      "5dc72294d5aa81af5650f0e3": 'optionOne',
      "5dc722c0d5aa81af5650f0e4": 'optionTwo',
    },
    questions: ['5dc72255d5aa81af5650f0e2', '5dc72294d5aa81af5650f0e3'],
    username: 'tylert',
    password: '$2b$08$rOc/Tqp6YXLIgxweArU1S.zv6XW.c7B2edZTUlxcl2y/Iuh3CRA4S',
    isDisabled: false,
  },
  {
    _id: ObjectId('5dc72349d5aa81af5650f0e7'),
    name: 'John J.',
    avatarURL: "cat3.jpg",
    answers: {
      "5dc722c0d5aa81af5650f0e4": 'optionOne',
      "5dc72294d5aa81af5650f0e3": 'optionTwo',
      "5dc721d182ef37213dfbe9aa": 'optionTwo'
    },
    questions: ['5dc721d182ef37213dfbe9aa', '5dc722c0d5aa81af5650f0e4'],
    username: 'johnj',
    password: '$2b$08$dhVr.mgwkR5URGk8OW520.aoFRgXKFojAHo1qX8CnFDUHUVdxfamm',
    isDisabled: false,
  }
])

db.question.insertMany([
  {
    _id: ObjectId('5dc720dc0f051afb6fd6db41'),
    author: '5dc72349d5aa81af5650f0e5',
    timestamp: 1467166872634,
    optionOne: {
      votes: ['5dc72349d5aa81af5650f0e5'],
      text: 'have horrible short term memory',
    },
    optionTwo: {
      votes: [],
      text: 'have horrible long term memory'
    }
  },
  {
    _id: ObjectId('5dc721d182ef37213dfbe9aa'),
    author: '5dc72349d5aa81af5650f0e7',
    timestamp: 1468479767190,
    optionOne: {
      votes: [],
      text: 'become a superhero',
    },
    optionTwo: {
      votes: ['5dc72349d5aa81af5650f0e7', '5dc72349d5aa81af5650f0e5'],
      text: 'become a supervillain'
    }
  },
  {
    _id: ObjectId('5dc7220e82ef37213dfbe9ab'),
    author: '5dc72349d5aa81af5650f0e5',
    timestamp: 1488579767190,
    optionOne: {
      votes: [],
      text: 'be telekinetic',
    },
    optionTwo: {
      votes: ['5dc72349d5aa81af5650f0e5'],
      text: 'be telepathic'
    }
  },
  {
    _id: ObjectId('5dc72255d5aa81af5650f0e2'),
    author: '5dc72349d5aa81af5650f0e6',
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
       text: 'be a front-end developer',      
    },
    optionTwo: {
      votes: ['5dc72349d5aa81af5650f0e5'],
      text: 'be a back-end developer'
    }
  },
  {
    _id: ObjectId('5dc72294d5aa81af5650f0e3'),
    author: '5dc72349d5aa81af5650f0e6',
    timestamp: 1489579767190,
    optionOne: {
      votes: ['5dc72349d5aa81af5650f0e6'],
      text: 'find $50 yourself',
    },
    optionTwo: {
      votes: ['5dc72349d5aa81af5650f0e7'],
      text: 'have your best friend find $500'
    }
  },
  {
    _id: ObjectId('5dc722c0d5aa81af5650f0e4'),
    author: '5dc72349d5aa81af5650f0e7',
    timestamp: 1493579767190,
    optionOne: {
      votes: ['5dc72349d5aa81af5650f0e7'],
      text: 'write JavaScript',
    },
    optionTwo: {
      votes: ['5dc72349d5aa81af5650f0e6'],
      text: 'write Swift'
    }
  }
]);
