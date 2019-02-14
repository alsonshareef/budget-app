
// BUDGET CONTROLLER
const budgetController = (function() {

})()


// UI CONTROLLER
const UIController = (function() {

})()


// MAIN APP CONTROLLER
const appController = (function(budgetCtrl, UICtrl) {

    // Handles the input data
    let addItem = () => {
        /*
            1. Gather input data
            2. Add item to budget controller
            3. Add item to UI controller
            4. Calculate the budget
            5. Display budget on the UI
        */
    }


    // Event listeners for button and enter keypress to run 'addItem'
    document.querySelector('.add__btn').addEventListener('click', addItem)
    document.addEventListener('keypress', (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            addItem()
        }
    })

})(budgetController, UIController)
