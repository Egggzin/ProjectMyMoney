function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function calculateRequiredContribution(
  goalFinancial = 0,
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  returnRate = 0,
  returnTimeFrame = "monthly",
) {
  if (!goalFinancial || !timeHorizon || !returnRate) {
    throw new Error(
      "Meta financeira, prazo e rentabilidade devem ser preenchidos",
    );
  }
  const monthlyRate =
    returnTimeFrame === "monthly"
      ? returnRate / 100
      : convertToMontlyReturnRate(1 + returnRate / 100) - 1;

  const finalTimeMonth =
    timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  const referenceInvestimentObject = {
    investedAmount: startingAmount,
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

    const investedAmount = previousMonth.investedAmount + monthlyContribution;

    const interestReturn = previousMonth.totalAmount * monthlyRate;

    const totalInterestReturns =
      previousMonth.totalInterestReturns + interestReturn;

    const totalAmount =
      previousMonth.totalAmount + interestReturn + monthlyContribution;

    returnsArray.push({
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
