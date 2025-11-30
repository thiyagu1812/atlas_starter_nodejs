<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Expense Tracker</title>
    <style>
        /* CSS styles (same as before) */
    </style>
</head>
<body>

<div class="container">
    <h1>Monthly Expense Tracker</h1>

    <!-- Input Section -->
    <div class="input-group">
        <input type="date" id="expenseDate">
        <input type="text" id="expenseName" placeholder="Expense Name">
        <select id="expenseCategory">
            <option value="">Category</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Rent</option>
            <option>Medical</option>
            <option>Entertainment</option>
            <option>Other</option>
        </select>
        <input type="number" id="expenseAmount" placeholder="Amount">
        <button onclick="addExpense()">Add</button>
    </div>

    <!-- Upload Excel Section -->
    <div>
        <h2>Upload Excel File (Chase or Capital One)</h2>
        <input type="file" id="excelFile" />
        <button onclick="uploadExcel()">Upload</button>
    </div>

    <!-- Expense Table -->
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount ($)</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="expenseTableBody"></tbody>
    </table>

    <!-- Total -->
    <div class="total-box">
        Total Monthly Expense: <strong id="totalAmount">$0</strong>
    </div>

</div>

<script>
    // Add expense function
    function addExpense() {
        let date = document.getElementById("expenseDate").value;
        let name = document.getElementById("expenseName").value;
        let category = document.getElementById("expenseCategory").value;
        let amount = parseFloat(document.getElementById("expenseAmount").value);

        if (!date || !name || !category || !amount) {
            alert("Please fill all fields.");
            return;
        }

        let expense = { date, name, category, amount };
        
        fetch('http://localhost:5000/addExpense', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        }).then(response => response.json())
          .then(() => renderTable())
          .catch(err => alert("Error adding expense: " + err));
    }

    // Upload Excel file
    function uploadExcel() {
        const fileInput = document.getElementById("excelFile");
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        fetch('http://localhost:5000/uploadExcel', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(() => renderTable())
          .catch(err => alert("Error uploading file: " + err));
    }

    // Render expense table (simplified for this example)
    function renderTable() {
        fetch('http://localhost:5000/expenses')  // Assuming you have a GET endpoint to fetch expenses
            .then(response => response.json())
            .then(data => {
                let tableBody = document.getElementById("expenseTableBody");
                tableBody.innerHTML = "";  // Clear previous rows

                data.forEach((expense, index) => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${expense.date}</td>
                            <td>${expense.name}</td>
                            <td>${expense.category}</td>
                            <td>$${expense.amount.toFixed(2)}</td>
                            <td><button onclick="deleteExpense(${expense._id})">Delete</button></td>
                        </tr>
                    `;
                });

                // Update total
                const total = data.reduce((sum, expense) => sum + expense.amount, 0);
                document.getElementById("totalAmount").innerText = `$${total.toFixed(2)}`;
            })
            .catch(err => alert("Error fetching expenses: " + err));
    }
</script>

</body>
</html>
