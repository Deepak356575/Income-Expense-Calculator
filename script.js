const description = document.getElementById('description');
const amount = document.getElementById('amount');
const entryType = document.getElementById('entry-type');
const entriesList = document.getElementById('entries-list');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const balance = document.getElementById('balance');
const filters = document.getElementsByName('filter');
const resetBtn = document.getElementById('reset-btn');



let entries = JSON.parse(localStorage.getItem('entries')) || [];

document.getElementById('add-btn').addEventListener('click', () => {
  if (description.value && amount.value) {
    const entry = {
      id: Date.now(),
      description: description.value,
      amount: +(amount.value),
      type: entryType.value
    };
    entries.push(entry);
    saveAndRenderEntries();

    description.value = '';
    amount.value = '';
    entryType.value = 'income'; 
  }
  else {
    alert("Please enter both description and amount!");
  }
});


function saveAndRenderEntries() {
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

function renderEntries() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  entriesList.innerHTML = '';
  let income = 0, expenses = 0;

  entries.filter(entry => filter === 'all' || entry.type === filter)
    .forEach(entry => {
      const entryItem = document.createElement('li');
      entryItem.innerHTML = `
        ${entry.description} - ₹${entry.amount.toFixed(2)}
        <div>
          <button onclick="editEntry(${entry.id})">Edit</button>
          <button onclick="deleteEntry(${entry.id})">Delete</button>
        </div>`;
      entriesList.appendChild(entryItem);

      if (entry.type === 'income') income += entry.amount;
      else expenses += entry.amount;
    });

  totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpenses.textContent = `₹${expenses.toFixed(2)}`;
  balance.textContent = `₹${(income - expenses).toFixed(2)}`;
}

function editEntry(id) {
  const entry = entries.find(entry => entry.id === id);
  description.value = entry.description;
  amount.value = entry.amount;
  entryType.value = entry.type;
  deleteEntry(id);
}

function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  saveAndRenderEntries();
}

function resetAllEntries() {
  if (confirm("Are you sure you want to delete all entries?")) {
    entries = []; 
    localStorage.removeItem('entries'); 
    renderEntries(); 
    
    totalIncome.textContent = '₹0.00';
    totalExpenses.textContent = '₹0.00';
    balance.textContent = '₹0.00';
    
    alert("All entries have been deleted.");
  }
}

resetBtn.addEventListener('click', resetAllEntries);


filters.forEach(filter => filter.addEventListener('change', renderEntries));

document.addEventListener('DOMContentLoaded', renderEntries);
