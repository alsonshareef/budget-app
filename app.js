
// BUDGET CONTROLLER
const budgetController = (function() {

    let Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    let Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    let calculateTotal = (type) => {
        let sum = 0
        data.allItems[type].forEach((item) => {
            sum += item.value
        })

        data.totals[type] = sum
    }

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
        calculateBudget: () => {
            // 1. Calculate total income and expenses
                calculateTotal('expense')
                calculateTotal('income')
            
            // 2. Calculate budget (income - expenses)
                data.budget = data.totals.income - data.totals.expense

            // 3. Calculate percentage of income spent (expenses / income)
                if (data.totals.income > 0) {
                    data.percentage = Math.round((data.totals.expense / data.totals.income) * 100)
                }
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        }
    }

})()


// UI CONTROLLER
const UIController = (function() {

    let DOMelements = {
        inputType: document.querySelector('.add__type'),
        inputDescription: document.querySelector('.add__description'),
        inputValue: document.querySelector('.add__value'),
        addButton: document.querySelector('.add__btn'),
        incomeList: document.querySelector('.income__list'),
        expenseList: document.querySelector('.expenses__list'),
        fields: document.querySelectorAll(`.add__description, .add__value`) // this prop selects both input description and value fields
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
        clearFields: () => {
            let fieldsArray

            fieldsArray = Array.prototype.slice.call(DOMelements.fields) // Turn DOMelements.fields list into an array using call to set 'this'

            fieldsArray.forEach(field => { // Loops over each field and sets .value to empty string
                field.value = ''
            });

            fieldsArray[0].focus() // Reset focus to description field for easy UX
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
        }

        let updateBudget = () => {
            // 1. Calculate the budget
                budgetCtrl.calculateBudget()

            // 2. Return budget
                let budget = budgetCtrl.getBudget()

            // 3. Display budget on the UI
            console.log(budget)

        }

    // Handles the input data
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

            } 
        }

    // Initialization
        return {
            init: function() {
                console.log('App started!')
                setupEventListeners()
            }
        }

})(budgetController, UIController)

// Starts application
    appController.init()
