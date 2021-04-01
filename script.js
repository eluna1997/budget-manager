const budgetController = (function () {
    var Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        console.log(id);
    };
    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
    var calcTotal = function (type) {
        var suma = 0;
        data.allItems[type].forEach(function (cur) {
            suma = suma + cur.value;
        })
        data.totals[type] = suma;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0
    }
    return {
        addItem: function (type, des, val) {
            var newItem, ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else { ID = 0; }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calcBudget: function () {
            calcTotal('exp');
            calcTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
        },
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (cur) {
                return cur.id;
            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
    };
})();

let UIController = (function () {
    let DOMstring = {

        type: '.add-type',
        description: '.add-reason',
        value: '.add-value',
        incomeContainer: '.income-list',
        expenseContainer: '.expenses-list',
        Income: '.budget-income-value',
        Expenses: '.budget-expenses-value',
        AllBudgetValue: '.budget-value',
        conatainer: '.container'
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector('.add-type').value,
                description: document.querySelector('.add-reason').value,
                value: parseFloat(document.querySelector('.add-value').value)
            };
        },
        addListItem: function (obj, type) {
            var html, newHTML, element;
            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            }
            else if (type === 'exp') {
                element = DOMstring.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div> <div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
            }
            newHtml = html.replace('%id%', obj.id);
            console.log(obj.desc);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        updateMonth() {
            now = new Date();
            months = now.getMonth();

            let month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

            document.querySelector('.budget-title-month').textContent = month[months];
        },
        deleteList: function (selector) {
            var el = document.getElementById(selector);
            el.parentNode.removeChild(el);
        },
        clearField: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstring.description + ',' + DOMstring.value)
            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArr[0].focus();
        },
        addHeader: function (IE) {
            document.querySelector(DOMstring.Income).textContent = IE.totalInc;
            document.querySelector(DOMstring.Expenses).textContent = IE.totalExp;
            document.querySelector(DOMstring.AllBudgetValue).textContent = IE.budget;
        }
    };
})();
var controller = (function (UIcontroller, budgetcontroller) {
    UIcontroller.updateMonth();
    let updateBudget = function () {
        budgetcontroller.calcBudget();
        let budget = budgetcontroller.getBudget();
        UIcontroller.addHeader(budget);
    }
    const addButton = function () {
        var input, newItem;
        var input = UIcontroller.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetcontroller.addItem(input.type, input.description, input.value);
            UIcontroller.addListItem(newItem, input.type);

            UIcontroller.clearField();
            updateBudget();
        }
        else {
            alert("Need more information")
        };
    }
    const DeleteItem = function (event) {

        var ItemID, splitID, type, ID;

        ItemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = ItemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        budgetcontroller.deleteItem(type, ID);
        UIcontroller.deleteList(ItemID);
        updateBudget();
    }
    document.querySelector('.add-btn').addEventListener('click', addButton);
    document.querySelector('.container').addEventListener('click', DeleteItem);

})(UIController, budgetController);