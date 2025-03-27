export function formatDate(dateString, isRecurring, recurringFrequency) {
  // If recurring, display the frequency in a capitalized form
  if (isRecurring && recurringFrequency) {
    return `${recurringFrequency
      .charAt(0)
      .toUpperCase()}${recurringFrequency.slice(1)}`;
  }

  // Otherwise, parse date normally
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";

  // Format as dd/mm/yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
