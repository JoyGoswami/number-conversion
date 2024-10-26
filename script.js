const numberInput = document.getElementById("number");
const fromValue = document.getElementById("from").value;
const toValue = document.getElementById("to").value;
const form = document.getElementById("form");
const resultDisplay = document.querySelector(".result-display");
const stepDisplay = document.querySelector(".step-display");

let stepDataObj = {};

// validate input field
// numberInput.addEventListener("input", (e) => {
//   console.log(numberInput.value);
// });
// form sumbit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formObj = new FormData(form);

  const formData = {};
  formObj.forEach((value, key) => {
    formData[key] = value;
  });

  // it checks whether the result table already exist or not
  // if exists, it deletes that table
  const table = document.querySelector("table");
  if (table) {
    table.remove();
  }

  // it checks if the number has fraction
  // if it has, then separates it
  // and stores it in "integer and fraction" variables
  // then add it the "formData" object
  if (formData.number.includes(".")) {
    const [integer, fraction] = formData.number.split(".");
    formData.integer = integer;
    formData.fraction = fraction;
  }
  console.log(formData);
  displayResult(formData.integer, formData.to);
});

function displayResult(number, type) {
  // this function displays the converted result
  // based on the submited number
  let submitedNum = Number(number);
  let base = checkBase(type);

  resultDisplay.textContent = submitedNum.toString(base);

  conversionSteps(submitedNum, base);
}

function conversionSteps(number, base) {
  console.log(number, base);
  let currentNumber = number;
  let currentNumArr = [];
  let remainderNumArr = [];
  let quotientNumArr = [];

  //   let stepDataObj = {};

  while (currentNumber > 0) {
    currentNumArr.push(currentNumber);

    let remainder = currentNumber % base;
    let quotient = Math.floor(currentNumber / base);

    remainderNumArr.push(remainder);
    quotientNumArr.push(quotient);

    stepDataObj.division = currentNumArr;
    stepDataObj.quotient = quotientNumArr;
    stepDataObj.remainder = remainderNumArr;
    stepDataObj.base = base;

    currentNumber = Math.floor(currentNumber / base);
  }

  createTable(
    stepDataObj.division,
    stepDataObj.quotient,
    stepDataObj.remainder,
    stepDataObj
  );
}

function checkBase(type) {
  //this function assigns and returns
  //the base of the number based on "to" select value
  let base;
  switch (type) {
    case "decimal":
      base = 10;
      break;
    case "binary":
      base = 2;
      break;
    case "octal":
      base = 8;
      break;
    case "hexadecimal":
      base = 16;
      break;
  }
  return base;
}

function createTable(division, quotient, remainder, stepObj) {
  const table = document.createElement("table");
  const headingNameArr = Object.keys(stepObj);
  const base = stepObj.base;

  //   table head
  const tableHeader = document.createElement("thead");
  const headTr = document.createElement("tr");
  const firstHeadTh = document.createElement("th");
  firstHeadTh.textContent = `${headingNameArr[0]} by ${base}`;
  headTr.append(firstHeadTh);
  headingNameArr.shift();
  headingNameArr.pop();
  headingNameArr.map((name) => {
    const headTh = document.createElement("th");
    headTh.textContent = name;
    headTr.append(headTh);
  });
  tableHeader.append(headTr);
  //   table head

  //   table body
  const tableBody = document.createElement("tbody");

  division.map((divisions, index) => {
    const tr = document.createElement("tr");

    const divisionCell = document.createElement("td");
    divisionCell.textContent = `${division[index]} ÷ ${base}`;
    tr.append(divisionCell);

    const quotientCell = document.createElement("td");
    quotientCell.textContent = quotient[index];
    tr.append(quotientCell);

    const remainderCell = document.createElement("td");
    remainderCell.textContent = remainder[index];
    tr.append(remainderCell);

    tableBody.append(tr);
  });

  //   table body

  table.append(tableHeader, tableBody);
  stepDisplay.append(table);
}
