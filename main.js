import { calculateRequiredContribution } from "./src/investiment.js";
const form = document.getElementById("investiment-form");
const clearButton = document.getElementById("clearButton");

function renderProgression(evt) {
  evt.preventDefault();

  if (document.querySelector(".error")) {
    return;
  }

  const startingAmount = Number(
    document.getElementById("initial-investment").value.replace(",", "."),
  );
  const goalFinancial = Number(
    document.getElementById("goal-financial").value.replace(",", "."),
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", "."),
  );
  const evaluationPeriod = document.getElementById("evaluation-period").value;
  const returnsArray = calculateRequiredContribution(
    goalFinancial,
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    returnRate,
    evaluationPeriod,
  );
  console.log(returnsArray);
}

function clearForm() {
  form["initial-investment"].value = "";
  form["goal-financial"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";

  const errorInputsContainers = document.querySelectorAll(".error");
  for (const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove("error");
    errorInputsContainer.parentElement.querySelector("p").remove();
  }
}
function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    (!parentElement.classList.contains("error") && isNaN(inputValue)) ||
    Number(inputValue) <= 0
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerHTML = "Insira um valor numérico e maior que zero";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}
for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
clearButton.addEventListener("click", clearForm);
