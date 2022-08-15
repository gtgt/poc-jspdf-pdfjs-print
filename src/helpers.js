import { faker } from "@faker-js/faker";
/*
 |--------------------------------------------------------------------------
 | Below is some helper functions for the examples
 |--------------------------------------------------------------------------
 */

function headRows() {
  return [
    { id: "ID", name: "Name", email: "Email", city: "City", expenses: "Sum" }
  ];
}

function footRows() {
  return [
    { id: "ID", name: "Name", email: "Email", city: "City", expenses: "Sum" }
  ];
}

function columns() {
  return [
    { header: "ID", dataKey: "id" },
    { header: "Name", dataKey: "name" },
    { header: "Email", dataKey: "email" },
    { header: "City", dataKey: "city" },
    { header: "Exp", dataKey: "expenses" }
  ];
}

function data(rowCount) {
  rowCount = rowCount || 10;
  var body = [];
  for (var j = 1; j <= rowCount; j++) {
    body.push({
      id: j,
      name: faker.name.findName(),
      email: faker.internet.email(),
      city: faker.address.city(),
      expenses: faker.finance.amount()
    });
  }
  return body;
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
      expenses: faker.finance.amount()
    });
  }
  return body;
}

export { headRows, footRows, columns, data, bodyRows };
