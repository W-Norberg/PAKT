const today = new Date();

const year = today.getFullYear();
const month = today.toLocaleString('en-US', { month: 'short' }); // Months are 0-based
const day = String(today.getDate()).padStart(2, '0');

let formattedDate = `${month}/${day}/${year}`;
document.getElementById("date").innerText = formattedDate;

