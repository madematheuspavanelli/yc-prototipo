const cards = [
  {
    type: "elo",
    patterns: [
      401178,
      401179,
      431274,
      438935,
      451416,
      457393,
      457631,
      457632,
      504175,
      627780,
      636297,
      636368,
      655000,
      655003,
      65500,
      651652,
      651653,
      651654,
      650485,
      650486,
      650487,
      650488,
      506699,
      506778,
      509000,
      509999
    ],
    length: [16],
    cvcLength: [3],
    luhn: false
  },
  {
    type: "jcb",
    patterns: [35],
    length: [16],
    cvcLength: [3]
  },
  {
    type: "aura",
    patterns: [50],
    length: [16],
    cvcLength: [3]
  },
  {
    type: "discover",
    patterns: [60, 64, 65],
    length: [16],
    cvcLength: [3],
    luhn: true
  },
  {
    type: "dinnersclub",
    patterns: [30, 36, 38, 39],
    length: [14],
    cvcLength: [3],
    luhn: true
  },
  {
    type: "unionpay",
    patterns: [62, 88],
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false
  },
  {
    type: "amex",
    patterns: [34, 37],
    length: [15, 16],
    cvcLength: [3, 4],
    luhn: true
  },
  {
    type: "hipercard",
    patterns: [38, 60],
    length: [13, 16, 19],
    cvcLength: [3],
    luhn: true
  },
  {
    type: "mastercard",
    patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
    length: [16],
    cvcLength: [3],
    luhn: true
  },
  {
    type: "visa",
    patterns: [4],
    length: [13, 16],
    cvcLength: [3],
    luhn: true
  }
];

export function validateCard(val) {
  val = val.replace(/\s+/g, "");
  let cardType;
  cards.forEach((card, index) => {
    card.patterns.forEach(pattern => {
      const firstDigits = parseInt(val.substring(0, 6));

      if (pattern.toString() == val.substring(0, pattern.toString().length)) {
        cardType = cards[index];
      }

      if (val.length >= 6 && cards[0].patterns.includes(firstDigits)) {
        cardType = cards[0];
      }
    });
  });

  return cardType;
}
