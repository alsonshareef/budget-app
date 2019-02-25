
// BUDGET CONTROLLER
const budgetController = (function() {

    // Function constructors for items
    let Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    let Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    // Expense prototype methods for calculating and retrieving individual expense percentages
    Expense.prototype.calcPercentage = (totalIncome) => {
        if (totalIncome > 0) {
            this.percentage = this.value
            console.log(this)
        } else {
            // console.log(this.value)
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = () => {
        return this.percentage
    }

    // Method for calculating income and expense totals
    let calculateTotal = (type) => {
        let sum = 0
        data.allItems[type].forEach((item) => {
            sum += item.value
        })

        data.totals[type] = sum
    }

    // Object to store all budget data
    let data = {
        allItems: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, desc, val) {
            let newItem, id;

            // Generates new ID based on id of last item in 'income' or 'expense' array
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                id = 0
            }

            // Generates new income or expense object
            if (type === 'expense') {
                newItem = new Expense(id, desc, val)
            } else if (type === 'income') {
                newItem = new Income(id, desc, val)
            }

            // Adds the newItem to its respective array in 'data' object
            data.allItems[type].push(newItem)

            // Returns the newItem to be used by other controllers
            return newItem
        },

        deleteItem: (type, ID) => {
            let idArray, index

            // Create an array holding all existing items id's
            idArray = data.allItems[type].map((item) => {
                return item.id
            })

            // Create a variable holding the index of the element-to-be-deleted's id within idArray
            index = idArray.indexOf(ID)

            // Delete item from within the budget data structure at index
            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }

        },

        calculateBudget: () => {
            // 1. Calculate total income and expenses
                calculateTotal('expense')
                calculateTotal('income')
            
            // 2. Calculate budget (income - expenses)
                data.budget = data.totals.income - data.totals.expense

            // 3. Calculate percentage of total income spent (expenses / income)
                if (data.totals.income > 0) {
                    data.percentage = Math.round((data.totals.expense / data.totals.income) * 100)
                }
        },

        calculatePercentages: function() {
            data.allItems.expense.forEach((item) => {
                item.calcPercentage(data.totals.income)
            })
        },

        getPercentages: function() {
            let allPercentages = data.allItems.expense.map((item) => {
                return item.getPercentage()
            })
            return allPercentages
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },

        test: () => {
            return data
        }
    }

})()


// UI CONTROLLER
const UIController = (function() {

    let DOMelements = {
        // Input fields
        inputType: document.querySelector('.add__type'),
        inputDescription: document.querySelector('.add__description'),
        inputValue: document.querySelector('.add__value'),
        addButton: document.querySelector('.add__btn'),
        fields: document.querySelectorAll(`.add__description, .add__value`), // this prop selects both input description and value fields

        // UI Lists
        incomeList: document.querySelector('.income__list'),
        expenseList: document.querySelector('.expenses__list'),
        container: document.querySelector('.container'),
        
        // UI Budget labels
        budgetValue: document.querySelector('.budget__value'),
        budgetIncome: document.querySelector('.budget__income--value'),
        budgetExpense: document.querySelector('.budget__expenses--value'),
        budgetExpensePercentage: document.querySelector('.budget__expenses--percentage')
    }

    return {
        getInput: function() {
            return {
                type: DOMelements.inputType.value, // Will look at the value attribute (income or expense), not the property
                description: DOMelements.inputDescription.value,
                value: Number(DOMelements.inputValue.value)
            }
        },

        addListItem: function(obj, type) {
            let html

            // Generate HTML string with obj.props added where necessary, and insert into DOM
            if (type === 'income') {
                html = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">+ ${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
                
                DOMelements.incomeList.innerHTML += html
            } else if (type === 'expense') {
                html = `<div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">- ${obj.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

                DOMelements.expenseList.innerHTML += html 
            }
        },

        deleteListItem: (selectorID) => {
            let deletedItem = document.getElementById(selectorID)
            deletedItem.parentNode.removeChild(deletedItem)
        },

        clearFields: () => {
            let fieldsArray

            fieldsArray = Array.prototype.slice.call(DOMelements.fields) // Turn DOMelements.fields list into an array using call to set 'this'

            fieldsArray.forEach(field => { // Loops over each field and sets .value to empty string
                field.value = ''
            });

            fieldsArray[0].focus() // Reset focus to description field for easy UX
        },

        displayBudget: (obj) => {

            // Convert budget UI text to data in budgetController
            DOMelements.budgetValue.textContent = `$${obj.budget}`
            DOMelements.budgetIncome.textContent = `+ ${obj.totalIncome}`
            DOMelements.budgetExpense.textContent = `- ${obj.totalExpense}`
            
            // Only displays expense percentage if income is greater than 0
            if (obj.percentage < 0) {
                DOMelements.budgetExpensePercentage.textContent = '-'
            } else {
                DOMelements.budgetExpensePercentage.textContent = `${obj.percentage}%`
            }

        },

        getDOMelements: function() {
            return DOMelements
        }
    }

})()


// MAIN APP CONTROLLER
const appController = (function(budgetCtrl, UICtrl) {

    // Setup event listeners
        let setupEventListeners = () => {
            // Stores local copy of DOMelements here using getDOMelement method of UIController
                let DOM = UICtrl.getDOMelements()

            // Event listeners for button and enter keypress to run 'addItem'
                DOM.addButton.addEventListener('click', addItem)
                document.addEventListener('keypress', (event) => {
                    if (event.keyCode === 13 || event.which === 13) {
                        addItem()
                    }
                })
            
            // Event listener for UI list container to run 'deleteItem'
                DOM.container.addEventListener('click', deleteItem)
        }
        
    // Will update budget after an item is added or deleted
        let updateBudget = () => {
            // 1. Calculate the budget
            budgetCtrl.calculateBudget()
            
            // 2. Return budget
            let budget = budgetCtrl.getBudget()
            
            // 3. Display budget on the UI
            UICtrl.displayBudget(budget)
            
        }
    
    // Will update all percentages after item is added or deleted
        let updatePercentages = () => {
            // Calculate percentages
            budgetCtrl.calculatePercentages()

            // Get percentages
            let percentages = budgetCtrl.getPercentages()

            // Update percentages
            console.log(percentages)

        }

    // Adds new item based on input data
        let addItem = () => {
            let input, newItem

            // 1. Gather input data
                input = UICtrl.getInput()

            if (input.description !== "" && input.value > 0) {

                // 2. Add item to budget controller
                    newItem = budgetCtrl.addItem(input.type, input.description, input.value)
    
                // 3. Add item to UI controller
                    UICtrl.addListItem(newItem, input.type)
    
                // 4. Clear input fields after adding item
                    UICtrl.clearFields()
                
                // 5. Calculate and update budget
                    updateBudget()

                // 6. Calculate and update percentages
                    updatePercentages()

            } 
        }
    
    // Deletes items in income/expense lists
        let deleteItem = (event) => {

            let itemID, splitID, type, id

            // Grab ID from parent item of the delete button
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

            // Create individual variables for type and id of item to be deleted
            if (itemID) {
                splitID = itemID.split('-')
                type = splitID[0]
                id = Number(splitID[1])
            }

            // Delete item from data structure in budgetController
            budgetCtrl.deleteItem(type, id)

            // Delete item from UI
            UICtrl.deleteListItem(itemID)

            // Update budget after deletion
            updateBudget()

            // Calculate and update percentages
            updatePercentages()

        }


    // Initialization
        return {
            init: function() {
                console.log('App started!')
                UICtrl.displayBudget({
                    budget: 0,
                    totalIncome: 0,
                    totalExpense: 0,
                    percentage: -1
                })
                setupEventListeners()
            }
        }

})(budgetController, UIController)

// Starts application
    appController.init()
