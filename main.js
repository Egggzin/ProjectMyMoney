import { Chart } from "chart.js/auto";
import { calculateRequiredContribution } from "./src/investiment.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investiment-form");
const clearButton = document.getElementById("clearButton");

let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrenty(value) {
  return value.tofixed();
}
function renderProgression(evt) {
  evt.preventDefault();

  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();
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
  const finalInvestimentObject = returnsArray[returnsArray.length - 1];
  // console.log(returnsArray);
  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Meu investimento", "Rendimento"],
      datasets: [
        {
          data: [
            finalInvestimentObject.investedAmount,
            finalInvestimentObject.totalInterestReturns,
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investimentObject) => investimentObject.month),
      datasets: [
        {
          label: "Patrimônio total",
          data: returnsArray.map((item) => item.totalAmount),
          borderColor: "#2563eb",
          backgroundColor: "transparent",
          borderWidth: 4,
          pointRadius: 0,
          hoverRadius: 5,
          tension: 0.3,
        },
        {
          label: "Total investido",
          data: returnsArray.map((item) => item.investedAmount),
          borderColor: "#ec4899",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          hoverRadius: 5,
          tension: 0.3,
        },
        {
          label: "Juros acumulados",
          data: returnsArray.map((item) => item.totalInterestReturns),
          borderColor: "#f59e0b",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          hoverRadius: 5,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}
function clearForm() {
  form["initial-investment"].value = "";
  form["goal-financial"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  resetCharts();

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
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) < 0)
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerHTML = "Insira um valor numérico e maior que zero";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) >= 0
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
