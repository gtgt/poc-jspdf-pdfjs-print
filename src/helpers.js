import { faker } from "@faker-js/faker/locale/en";
/*
 |--------------------------------------------------------------------------
 | Below is some helper functions for the examples
 |--------------------------------------------------------------------------
 */

function headRows() {
  return [
    { id: "ID", name: "Name", email: "Email", city: "City", expenses: "Sum", notes: "Notes" }
  ];
}

function footRows() {
  return [
    { id: "ID", name: "Name", email: "Email", city: "City", expenses: "Sum" }
  ];
}

function bodyRows(rowCount) {
  rowCount = rowCount || 10;
  var body = [];
  for (var j = 1; j <= rowCount; j++) {
    body.push({
      id: j,
      name: faker.name.findName(),
      email: faker.internet.email(),
      city: faker.address.city(),
      expenses: faker.finance.amount(),
      notes: faker.fake('{{hacker.phrase}} Also {{hacker.phrase}}'),
    });
  }
  return body;
}
function columns() {
  return [
    { header: "ID", dataKey: "id" },
    { header: "Name", dataKey: "name" },
    { header: "Email", dataKey: "email" },
    { header: "City", dataKey: "city" },
    { header: "Breed", dataKey: "breed" }
  ];
}

function data(rowCount) {
  rowCount = rowCount || 10;
  var body = [];
  for (var j = 1; j <= rowCount; j++) {
    body.push({
      id: j,
      name: faker.name.firstName('female'),
      email: faker.internet.email(),
      city: faker.address.city(),
      expenses: faker.animal.cat()
    });
  }
  return body;
}

export { headRows, footRows, bodyRows, columns, data };
