// import { createServerModuleRunnerTransport } from "vite";

function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function calculateRequiredContribution(
  goalFinancial = 0,
  startingAmount = 0,
  timeHorizon = 0,
  returnRate = 0,
) {
  if (!goalFinancial || !timeHorizon || !returnRate) {
    throw new Error(
      "Meta financeira, prazo e rentabilidade devem ser preenchidos",
    );
  }
  const monthlyRate = convertToMontlyReturnRate(1 + returnRate / 100) - 1;

  const finalTimeMonth = timeHorizon * 12;

  const referenceInvestimentObject = {
    previousInvestedAmount: startingAmount,
    investedAmount: startingAmount,
    monthlyContribution: 0,
    interestReturn: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };
  const returnsArray = [referenceInvestimentObject];

  const futureInitialAmount =
    startingAmount * (1 + monthlyRate) ** finalTimeMonth;

  const remainingAmount = goalFinancial - futureInitialAmount;

  const monthlyContribution =
    monthlyRate === 0
      ? remainingAmount / finalTimeMonth
      : remainingAmount *
        (monthlyRate / ((1 + monthlyRate) ** finalTimeMonth - 1));

  for (let month = 1; month <= finalTimeMonth; month++) {
    const previousMonth = returnsArray[month - 1];
    const previousInvestedAmount = previousMonth.investedAmount;

    const investedAmount = previousMonth.investedAmount + monthlyContribution;

    const interestReturn = previousMonth.totalAmount * monthlyRate;

    const totalInterestReturns =
      previousMonth.totalInterestReturns + interestReturn;

    const totalAmount =
      previousMonth.totalAmount + interestReturn + monthlyContribution;

    returnsArray.push({
      startingAmount: Number(startingAmount.toFixed(2)),
      previousInvestedAmount: Number(previousInvestedAmount.toFixed(2)),
      investedAmount: Number(investedAmount.toFixed(2)),
      monthlyContribution: Number(monthlyContribution.toFixed(2)),
      interestReturn: Number(interestReturn.toFixed(2)),
      totalInterestReturns: Number(totalInterestReturns.toFixed(2)),
      month,
      totalAmount: Number(totalAmount.toFixed(2)),
    });
  }

  return returnsArray;
}
