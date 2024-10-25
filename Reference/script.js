document.getElementById("convertBtn").addEventListener("click", function () {
  const number = document.getElementById("number").value.trim();
  const fromBase = document.getElementById("fromBase").value;
  const toBase = document.getElementById("toBase").value;
  const result = document.getElementById("result");
  const steps = document.getElementById("steps");

  if (!number) {
    result.innerHTML = "Please enter a valid number.";
    steps.innerHTML = "";
    return;
  }

  let decimalValue;
  try {
    // Convert from input base to decimal
    switch (fromBase) {
      case "decimal":
        decimalValue = parseInt(number, 10);
        break;
      case "binary":
        decimalValue = parseInt(number, 2);
        break;
      case "octal":
        decimalValue = parseInt(number, 8);
        break;
      case "hexadecimal":
        decimalValue = parseInt(number, 16);
        break;
      default:
        result.innerHTML = "Invalid from base.";
        return;
    }

    if (isNaN(decimalValue)) {
      result.innerHTML = "Invalid input number.";
      steps.innerHTML = "";
      return;
    }

    // Convert from decimal to target base
    let convertedValue;
    let conversionSteps = `Conversion from ${fromBase} to ${toBase}:<br>`;

    switch (toBase) {
      case "decimal":
        convertedValue = decimalValue.toString(10);
        conversionSteps += `Already in decimal: ${convertedValue}`;
        break;
      case "binary":
        convertedValue = decimalValue.toString(2);
        conversionSteps += stepByStepDivision(decimalValue, 2);
        break;
      case "octal":
        convertedValue = decimalValue.toString(8);
        conversionSteps += stepByStepDivision(decimalValue, 8);
        break;
      case "hexadecimal":
        convertedValue = decimalValue.toString(16).toUpperCase();
        conversionSteps += stepByStepDivision(decimalValue, 16);
        break;
      default:
        result.innerHTML = "Invalid to base.";
        return;
    }

    result.innerHTML = `Result: ${convertedValue}`;
    steps.innerHTML = conversionSteps;
  } catch (err) {
    result.innerHTML = "Error in conversion.";
    steps.innerHTML = "";
  }
});

// Function to show step-by-step division method
function stepByStepDivision(number, base) {
  let steps = "";
  let currentNumber = number;

  while (currentNumber > 0) {
    const remainder = currentNumber % base;
    steps += `${currentNumber} ÷ ${base} = ${Math.floor(
      currentNumber / base
    )} (remainder: ${remainder})<br>`;
    currentNumber = Math.floor(currentNumber / base);
  }

  return steps;
}
