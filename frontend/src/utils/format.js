export const formatAmount = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "0,00";
  
    return Number(value)
      .toFixed(2)               // Two decimals
      .replace(".", ",")        // Decimal comma
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thousands separator
  };
  