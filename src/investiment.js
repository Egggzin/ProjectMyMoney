function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

function calculateRequiredContribution(
  goalFinancial = 0,
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  returnRate = 0,
  returnTimeFrame = "monthly",
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      "Investimento inicial e prazo devem ser preenchidos com valores positivos",
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

  // Quanto seu dinheiro atual vai virar sozinho
  const futureInitialAmount =
    startingAmount * (1 + monthlyRate) ** finalTimeMonth;

  // Quanto falta alcançar
  const remainingAmount = goalFinancial - futureInitialAmount;

  // Aporte mensal necessário
  const monthlyContribution =
    remainingAmount * (monthlyRate / ((1 + monthlyRate) ** finalTimeMonth - 1));

  for (let month = 1; month <= finalTimeMonth; month++) {
    const previousMonth = returnsArray[month - 1];

    const investedAmount = previousMonth.investedAmount + monthlyContribution;

    const interestReturn = previousMonth.totalAmount * monthlyRate;

    const totalInterestReturns =
      previousMonth.totalInterestReturns + interestReturn;

    const totalAmount =
      previousMonth.totalAmount + interestReturn + monthlyContribution;

    returnsArray.push({
      investedAmount,
      interestReturn,
      totalInterestReturns,
      month,
      totalAmount,
    });
  }

  return returnsArray;
}
