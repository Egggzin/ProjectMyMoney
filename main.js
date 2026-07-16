import { Chart } from "chart.js/auto";
import { calculateRequiredContribution } from "./src/investiment.js";
import { createTable } from "./src/table.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investiment-form");
const clearButton = document.getElementById("clearButton");

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Periodo", accessor: "month" },
  {
    columnLabel: "aporte",
    accessor: "previousInvestedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Aportes Mensais",
    accessor: "monthlyContribution",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Juros Mensais",
    accessor: "interestReturn",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Total Juros",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Saldo Total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];
function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatCurrencyToGraph(value) {
  return value.toFixed(1);
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
  // const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", "."),
  );
  // const evaluationPeriod = document.getElementById("evaluation-period").value;

  const returnsArray = calculateRequiredContribution(
    goalFinancial,
    startingAmount,
    timeAmount,
    returnRate,
  );
  const yearlyReturns = returnsArray.filter(
    (item) => item.month === 0 || item.month % 12 === 0,
  );
  const finalInvestimentObject = returnsArray[returnsArray.length - 1];
  // console.log(returnsArray);
  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Aporte Inicial", "Aportes Mensais", "Juros Acumulados"],
      datasets: [
        {
          data: [
            finalInvestimentObject.startingAmount,
            finalInvestimentObject.investedAmount,
            finalInvestimentObject.totalInterestReturns,
          ],
          backgroundColor: ["#74777c", "#101114", "#315efb"],

          borderColor: "#f8f5ef",
          borderWidth: 3,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "58%",

      layout: {
        padding: 10,
      },
      plugins: {
        legend: {
          display: true,
          position: "right",
          align: "center",

          labels: {
            boxWidth: 14,
            boxHeight: 14,
            padding: 15,
          },
        },
      },
    },
  });
  progressionChartReference = new Chart(progressionChart, {
    type: "bar",

    data: {
      labels: yearlyReturns.map((item) =>
        item.month === 0 ? "Início" : `Ano ${item.month / 12}`,
      ),

      datasets: [
        {
          label: "Total investido",
          data: yearlyReturns.map((item) => item.previousInvestedAmount),
          backgroundColor: "#74777c",
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.85,
          categoryPercentage: 0.9,
        },
        {
          label: "Aporte do último mês",
          data: yearlyReturns.map((item) => item.monthlyContribution),
          backgroundColor: "#101114",
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.85,
          categoryPercentage: 0.9,
        },
        {
          label: "Juros acumulados",
          data: yearlyReturns.map((item) => item.totalInterestReturns),
          backgroundColor: "#315efb",
          borderRadius: 3,
          borderSkipped: false,
          barPercentage: 0.85,
          categoryPercentage: 0.9,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          position: "top",
          align: "start",

          labels: {
            boxWidth: 28,
            boxHeight: 10,
            padding: 12,
            color: "#6b7280",
          },
        },

        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${formatCurrencyToTable(
                context.raw,
              )}`;
            },
          },
        },
      },

      scales: {
        x: {
          stacked: true,

          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: "#6b7280",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,

            callback(value, index) {
              const month = returnsArray[index]?.month;

              if (month === 0) {
                return "Início";
              }

              if (month % 12 === 0) {
                return `Ano ${month / 12}`;
              }

              return "";
            },
          },
        },

        y: {
          stacked: true,
          beginAtZero: true,

          border: {
            display: false,
          },

          grid: {
            color: "#e5e7eb",
            drawTicks: false,
          },

          ticks: {
            color: "#6b7280",
            padding: 10,

            // callback(value) {
            //   return formatCompactCurrency(value);
            // },
          },
        },
      },
    },
  });
  createTable(columnsArray, returnsArray, "results-table");
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

const mainEl = document.querySelector("main");
const carouselEl = document.getElementById("carousel");
const nextButton = document.getElementById("slide-arrow-next");
const previousButton = document.getElementById("slide-arrow-previous");

form.addEventListener("submit", renderProgression);
clearButton.addEventListener("click", clearForm);
