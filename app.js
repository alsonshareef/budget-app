
// BUDGET CONTROLLER
const budgetController = (function() {

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
                type: DOMelements.inputType.value, // Will look at the value attribute, not the property
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

    // Stores local copy of DOMelements here using getDOMelement method of UIController
    let DOM = UICtrl.getDOMelements()

    // Handles the input data
    let addItem = () => {
        // 1. Gather input data
            let input = UICtrl.getInput()
            console.log(input)
        // 2. Add item to budget controller
        // 3. Add item to UI controller
        // 4. Calculate the budget
        // 5. Display budget on the UI
    }

    // Event listeners for button and enter keypress to run 'addItem'
    DOM.addButton.addEventListener('click', addItem)
    document.addEventListener('keypress', (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            addItem()
        }
    })

})(budgetController, UIController)
