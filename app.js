
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

    let data = {
        allItems: {
            income: [],
            expense: []
        },
        totals: {
            income: 0,
            expense: 0
        }
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

            // Adds the newItem to its respective array in data structure
            data.allItems[type].push(newItem)

            // Returns the newItem to be used by other controllers
            return newItem
        }
    }

})()


// UI CONTROLLER
const UIController = (function() {

    let DOMelements = {
        inputType: document.querySelector('.add__type'),
        inputDescription: document.querySelector('.add__description'),
        inputValue: document.querySelector('.add__value'),
        addButton: document.querySelector('.add__btn')
    }

    return {
        getInput: function() {
            return {
                type: DOMelements.inputType.value, // Will look at the value attribute (income or expense), not the property
                description: DOMelements.inputDescription.value,
                value: DOMelements.inputValue.value
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
        }

    // Handles the input data
        let addItem = () => {
            let input, newItem

            // 1. Gather input data
                input = UICtrl.getInput()

            // 2. Add item to budget controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. Add item to UI controller
            // 4. Calculate the budget
            // 5. Display budget on the UI
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
