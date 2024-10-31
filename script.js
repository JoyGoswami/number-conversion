const numberInput = document.getElementById("number");
const fromValue = document.getElementById("from").value;
const toValue = document.getElementById("to").value;
const form = document.getElementById("form");
const resultDisplay = document.querySelector(".result-display");
const stepDisplay = document.querySelector(".step-display");
const btn = document.getElementById("btn");
const errorMsgEl = document.querySelector(".error-msg");

let stepDataObj = {};

// let integerStepsDataObj = {};
// let fractionStepsDataObj = {};

// validate input field
numberInput.addEventListener("input", (e) => {
  let number = numberInput.value;

  let validateDot = number.split(".");
  if (validateDot.length >= 3) {
    btn.disabled = true;
    errorMsgEl.style.display = "block";
  } else {
    btn.disabled = false;
    errorMsgEl.style.display = "none";
  }
});

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
  const integerTable = document.querySelector(".integer-table");
  const fractionTable = document.querySelector(".fraction-table");
  const title = document.querySelector(".title");

  if (integerTable) {
    integerTable.remove();
    integerStepsDataObj = {};
  }

  if (fractionTable) {
    fractionTable.remove();
    fractionStepsDataObj = {};
  }
  if (title) {
    title.remove();
  }
  // if(Object.keys(integerStepsDataObj).length > 0 || Object.keys(fractionStepsDataObj).length > 0){
  //   integerStepsDataObj = {}
  //   fractionStepsDataObj = {}
  // }

  // it checks if the number has fraction
  // if it has, then separates it
  // and stores it in "integer and fraction" variables
  // then add it the "formData" object
  if (formData.number.includes(".")) {
    const [integer, fraction] = formData.number.split(".");

    formData.integer = integer;
    formData.fraction = `0.${fraction}`;
  } else {
    formData.integer = formData.number;
  }

  displayResult(formData.number, formData.from, formData.to, formData);
  // const msg = formValidation(formData);
});

function displayResult(number, from, to, formData) {
  // this function displays the converted result
  // based on the submited number

  // let base = checkBase(to);

  if (from === "decimal") {
    let submitedNum = Number(number);

    let base = checkBase(to);

    if (isNaN(submitedNum)) {
      resultDisplay.textContent = "Invalid Number";
      resultDisplay.style.color = "red";
    } else {
      const convertedNumber = submitedNum.toString(base);

      const [integer, fraction] = convertedNumber.split(".");
      let fractionArr;
      let trimFractionArr = "";
      if (fraction) {
        fractionArr = fraction.split("");
        trimFractionArr = fractionArr.join("");

        if (fractionArr.length > 20) {
          trimFractionArr = fractionArr.splice(0, 20).concat("...").join("");
        }
      }

      if (trimFractionArr !== "") {
        resultDisplay.textContent = `${integer}.${trimFractionArr}`;
      } else {
        resultDisplay.textContent = integer;
      }

      resultDisplay.style.color = "black";
      // conversionSteps(submitedNum, base);
      fromDecimalConversionSteps(formData);
    }
  } else if (to === "decimal") {
    let decimalNum = toDecimal(number, from);
    resultDisplay.textContent = decimalNum;
  }
}

// this function convert any number to decimal number
function toDecimal(number, from) {
  let toDec = 0;
  let base = checkBase(from);
  console.log(base);
  for (let i = 0; i < number.length; i++) {
    const bit = number[number.length - 1 - i];
    console.log(from);
    if (bit !== "0") {
      toDec += Math.pow(base, i);
    }
  }
  return toDec;
}

// function conversionSteps(number, base) {
//   console.log(number, base);
//   let currentNumber = number;
//   let currentNumArr = [];
//   let remainderNumArr = [];
//   let quotientNumArr = [];

//   //   let stepDataObj = {};

//   while (currentNumber > 0) {
//     currentNumArr.push(currentNumber);

//     let remainder = currentNumber % base;
//     let quotient = Math.floor(currentNumber / base);

//     remainderNumArr.push(remainder);
//     quotientNumArr.push(quotient);

//     stepDataObj.division = currentNumArr;
//     stepDataObj.quotient = quotientNumArr;
//     stepDataObj.remainder = remainderNumArr;
//     stepDataObj.base = base;

//     currentNumber = Math.floor(currentNumber / base);
//   }

//   createTable(
//     stepDataObj.division,
//     stepDataObj.quotient,
//     stepDataObj.remainder,
//     stepDataObj
//   );
// }

function fromDecimalConversionSteps(formData) {
  const number = formData.integer;
  const fraction = formData.fraction || 0;
  const base = checkBase(formData.to);

  const integerStepsDataObj = stepsOfInteger(number, base);
  const fractionStepsDataObj = stepsOfFraction(fraction, base);

  if (Number(number) !== 0) {
    filterCreateTableEl(integerStepsDataObj, null, null);
  }
  if (Number(fraction) !== 0) {
    filterCreateTableEl(null, fractionStepsDataObj, null);
  }
  if (Number(number) === 0 && Number(fraction) === 0) {
    const MSG = "Not a valid number";
    // filterCreateTableEl(null, null, MSG);
    resultDisplay.textContent = MSG;
    resultDisplay.style.color = "red";
  }
  // filterCreateTableEl();
}

function stepsOfInteger(number, base) {
  // this function handles the integer part
  // it shows step by step how integer is converted

  let currentNumber = Number(number);
  let currentNumberArr = [];
  let remainderArr = [];
  let quotientNumArr = [];
  let integerStepsDataObj = {};

  while (currentNumber > 0) {
    //steps of integer part
    currentNumberArr.push(`${currentNumber} ÷ ${base}`);

    let remainder = currentNumber % base;
    let quotient = Math.floor(currentNumber / base);

    remainderArr.push(remainder);
    quotientNumArr.push(quotient);

    integerStepsDataObj[`Division by ${base}`] = currentNumberArr;
    integerStepsDataObj.quotient = quotientNumArr;
    integerStepsDataObj.remainder = remainderArr;
    // integerStepsDataObj.base = base;

    currentNumber = Math.floor(currentNumber / base);

    // steps of fraction part
  }

  return integerStepsDataObj;
}

function stepsOfFraction(fraction, base) {
  // this function handles the fraction part
  // it shows step by step how fraction is converted

  let currentNumber = Number(fraction);

  let fractionStepsDataObj = {};
  let currentNumberArr = [];
  let integerArr = [];
  let fractionArr = [];
  let productArr = [];

  while (currentNumber > 0) {
    currentNumberArr.push(`${currentNumber} × ${base}`);

    let product = currentNumber * base;

    let [productInt, productFra] = product.toString().split(".");

    let fraction = Number(`0.${productFra}`) || 0;

    integerArr.push(productInt);
    fractionArr.push(fraction);
    productArr.push(product);

    fractionStepsDataObj[`Multiplication by ${base}`] = currentNumberArr;
    fractionStepsDataObj.product = productArr;
    fractionStepsDataObj.fraction = fractionArr;
    fractionStepsDataObj.integer = integerArr;

    currentNumber = fraction;
    if (integerArr.length > 19) {
      currentNumber = 0;
    }
  }
  return fractionStepsDataObj;
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

// function createTable(division, quotient, remainder, stepObj) {
//   const table = document.createElement("table");
//   const headingNameArr = Object.keys(stepObj);
//   const base = stepObj.base;

//   //   table head
//   const tableHeader = document.createElement("thead");
//   const headTr = document.createElement("tr");
//   const firstHeadTh = document.createElement("th");
//   firstHeadTh.textContent = `${headingNameArr[0]} by ${base}`;
//   headTr.append(firstHeadTh);
//   headingNameArr.shift();
//   headingNameArr.pop();
//   headingNameArr.map((name) => {
//     const headTh = document.createElement("th");
//     headTh.textContent = name;
//     headTr.append(headTh);
//   });
//   tableHeader.append(headTr);
//   //   table head

//   //   table body
//   const tableBody = document.createElement("tbody");

//   division.map((divisions, index) => {
//     const tr = document.createElement("tr");

//     const divisionCell = document.createElement("td");
//     divisionCell.textContent = `${division[index]} ÷ ${base}`;
//     tr.append(divisionCell);

//     const quotientCell = document.createElement("td");
//     quotientCell.textContent = quotient[index];
//     tr.append(quotientCell);

//     const remainderCell = document.createElement("td");
//     remainderCell.textContent = remainder[index];
//     tr.append(remainderCell);

//     tableBody.append(tr);
//   });

//   //   table body

//   table.append(tableHeader, tableBody);
//   stepDisplay.append(table);
// }

function filterCreateTableEl(integerStepsDataObj, fractionStepsDataObj, msg) {
  if (integerStepsDataObj) {
    createStepsTableEl(integerStepsDataObj, "integer-table");
  }
  if (fractionStepsDataObj) {
    createStepsTableEl(fractionStepsDataObj, "fraction-table");
  }
  if (msg) {
    console.log(msg);
  }
}

function createStepsTableEl(stepObj, className) {
  // array of key names, comes from stepObj
  // used to create heading of the table
  const headingNameArr = Object.keys(stepObj);

  // create a table element
  const tableEl = document.createElement("table");
  tableEl.classList.add(className);

  // if title has value then it will create a title (p)

  if (headingNameArr.length === 4) {
    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = "Fraction Part";
    stepDisplay.appendChild(title);
  }

  // create table header(thead), table row(tr) in head
  // and table head(th) => depending on object keys

  const tableHead = document.createElement("thead");
  const headTr = document.createElement("tr");
  headingNameArr.map((heading) => {
    const tableHeading = document.createElement("th");
    tableHeading.textContent = heading;
    tableHead.append(tableHeading);
  });

  // create table body(tbody), table row(tr) in table body
  // and table data (td) => depending on object values

  const tableBody = document.createElement("tbody");
  stepObj[headingNameArr[0]].map((data, index) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = stepObj[headingNameArr[0]][index];
    tr.append(td1);

    const td2 = document.createElement("td");
    td2.textContent = stepObj[headingNameArr[1]][index];
    tr.append(td2);

    const td3 = document.createElement("td");
    td3.textContent = stepObj[headingNameArr[2]][index];
    tr.append(td3);

    if (stepObj[headingNameArr[3]]) {
      const td4 = document.createElement("td");
      td4.textContent = stepObj[headingNameArr[3]][index];
      tr.append(td4);
    }

    tableBody.append(tr);
  });

  // if fraction has a large value
  // we will calculate upto 20
  // after that we will use (.....) to show
  // the it has more values
  if (stepObj[headingNameArr[3]]) {
    if (stepObj.product.length === 20) {
      const tr = document.createElement("tr");

      const td = document.createElement("td");
      td.setAttribute("colspan", "4");
      td.textContent = "..............";
      tr.append(td);

      tableBody.append(tr);
    }
  }

  // attach thead, tbody to table element
  tableEl.append(tableHead, tableBody);
  // attach tableEl to StepDisplay
  stepDisplay.append(tableEl);
}

function createTableBodyEl() {}
