import charSplit from '../charSplit';

test('charSplit on comma', () => {
  expect(charSplit(`Roche,"Ciba geigy",Lonza`, ',')).toStrictEqual([
    'Roche',
    'Ciba geigy',
    'Lonza',
  ]);
  expect(charSplit(`'Roche',"Ciba geigy",'Lonza'`, ',')).toStrictEqual([
    'Roche',
    'Ciba geigy',
    'Lonza',
  ]);
  expect(charSplit(` 'Roche', "Ciba geigy" , 'Lonza'`, ',')).toStrictEqual([
    'Roche',
    'Ciba geigy',
    'Lonza',
  ]);
  expect(charSplit(`Roche, Novartis`, ',')).toStrictEqual([
    'Roche',
    'Novartis',
  ]);
  expect(charSplit(`Roche, 'Ciba geigy'`, ',')).toStrictEqual([
    'Roche',
    'Ciba geigy',
  ]);
  expect(charSplit(`'Paris, France', 'London, UK'`, ',')).toStrictEqual([
    'Paris, France',
    'London, UK',
  ]);
});

test('charSplit on space', () => {
  expect(charSplit(`Roche "Ciba geigy"`, ' ')).toStrictEqual([
    'Roche',
    'Ciba geigy',
  ]);
});

test('charSplit wth regexp', () => {
  //  expect(charSplit(`Roche "Ciba geigy"`, /[\t\r\n ]+/)).toStrictEqual([
  //   'Roche',
  //  'Ciba geigy',
  // ]);
  expect(charSplit(`Roche    \r\n   "Ciba geigy"`, /[\t\r\n ]+/)).toStrictEqual(
    ['Roche', 'Ciba geigy'],
  );
});
