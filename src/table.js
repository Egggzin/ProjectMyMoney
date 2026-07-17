const isNonEmptyArray = (arrayElement) => {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
};
export const createTable = (columsArray, dataArray, tableId) => {
  if (
    !isNonEmptyArray(columsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      "Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento da tabela selecionada",
    );
  }
  const tableElement = document.getElementById(tableId);
  if (!tableElement || tableElement.nodeName !== "TABLE") {
    throw new Error("ID informado não corresponde a nenhum elemento table");
  }
  createTableHeader(tableElement, columsArray);
  createTableBody(tableElement, dataArray, columsArray);
};

function createTableHeader(tableReference, columsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement("thead");
    tableReference.appendChild(thead);
    return thead;
  }
  const tableHeaderReference =
    tableReference.querySelector("thead") ?? createTheadElement(tableReference);
  tableHeaderReference.innerHTML = "";
  const headerRow = document.createElement("tr");
  [
    "sticky",
    "top-0",
    "z-10",
    "bg-white",
    "px-6",
    "py-5",
    "text-center",
    "text-xs",
    "font-bold",
    "uppercase",
    "text-gray-400",
    "border-b",
    "border-gray-200",
  ].forEach((cssClass) => headerRow.classList.add(cssClass));
  for (const tableColumnObject of columsArray) {
    const headerElement = /* html */ `<th class="text-center px-7 py-5" >${tableColumnObject.columnLabel}</th>`;
    headerRow.innerHTML += headerElement;
  }
  tableHeaderReference.appendChild(headerRow);
}
function createTableBody(tableReference, tableItems, columsArray) {
  //   const tableBodyReference = tableReference.querySelector("tbody");
  function createTbodyElement(tableReference) {
    const tbody = document.createElement("tbody");
    tableReference.appendChild(tbody);
    return tbody;
  }
  const tableBodyReference =
    tableReference.querySelector("tbody") ?? createTbodyElement(tableReference);
  tableBodyReference.innerHTML = "";
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement("tr");
    [
      "border-b",
      "border-gray-200",
      "hover:bg-gray-50",
      "transition-colors",
    ].forEach((cssClass) => tableRow.classList.add(cssClass));
    // if (itemIndex % 2 !== 0) {
    //   tableRow.classList.add("bg-blue-200");
    // }
    for (const tableColumn of columsArray) {
      const formatFn = tableColumn.format ?? ((info) => info);
      tableRow.innerHTML += /*html*/ `<td class="px-6 py-5 text-center font-mono text-gray-700">${formatFn(tableItem[tableColumn.accessor])}</td>`;
    }
    tableBodyReference.appendChild(tableRow);
  }
}
