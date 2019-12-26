const inputs = document.querySelectorAll(".input");
const dot = document.getElementById("dot");
const operators = document.querySelectorAll(".operator");
const equal = document.getElementById("equal");
const clear = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const operationsDisplay = document.getElementById("operands");
const resultDisplay = document.getElementById("result");
let operandArray=[], operand = [], operator = [],result;


/*Adds keyboard support*/
document.addEventListener('keydown', (e) => {
    const button = document.querySelector(`button[data-key="${e.keyCode}"]`);

    if(button){
        if(button.getAttribute("class")==="input"){
            pushInput(button.textContent);
        }else if(button.getAttribute("id")==="dot"){
            addDecimalPoint();
        }else if(button.getAttribute("id")==="clear"){
            clearAll();
        }else if(button.getAttribute("id")==="backspace"){
            deleteCharacter();
        }else if(button.getAttribute("class")==="operator"){
            pushOperator(button.textContent);
        }else if(button.getAttribute("id")==="equal"){
            performOperation();
        }else{
            // do nothing
        }

        button.classList.add("pressed");

    }

});


const buttons = document.querySelectorAll("button");

buttons.forEach(button =>{
    button.addEventListener('transitionend', removeTransition);
})


function removeTransition(e){
    if(e.propertyName !== 'transform') return;

    this.classList.remove("pressed");
}




inputs.forEach(number => {
    number.addEventListener('click', getNumber);
})

dot.addEventListener('click',addDecimalPoint);

operators.forEach(operator => {
    operator.addEventListener('click', getOperator)
})

equal.addEventListener('click', performOperation);

clear.addEventListener('click', clearAll);

backspace.addEventListener('click',deleteCharacter);

//Capture inputs in a temporary array
function getNumber(){
    pushInput(this.textContent);
}

function pushInput(n){
    operandArray.push(+n);
    resultDisplay.textContent = operandArray.join("");
}


function addDecimalPoint(){
    if(operandArray.find(item => item == ".")){
        //do nothing if decimal point already exists
    }else{
        operandArray.push(".");
        resultDisplay.textContent = operandArray.join("");
    }
}

function deleteCharacter(){
    operandArray.pop();
    resultDisplay.textContent = operandArray.join("");
}



//Capture the operator
function getOperator(){    

    pushOperator(this.textContent);
    
}


function pushOperator(n){
    pushOperand(); 

    //push the operator
    if(operand.length <= operator.length){
        operator.pop();     //replace operator if user did not input a number before pressing the operator
    }
        operator.push(n);
        displayOperation();
}



//Store the operand
function pushOperand(){
        //push the operand if user inputted a number before pressing the operator
        if(operandArray[0] !== undefined){
            if(operator[0]===undefined){
                operand.pop(); //remove existing operand if it is the result of previous operation and no existing operation with it is found
            }
            operand.push(+operandArray.join(""));
            operandArray =[];
        }
}



//Display Operation in top bar
function displayOperation(){
    let display = "";

    operand.forEach((item,index)=>{
        display += `${item}`;
        if(operator[index]){
            display += ` ${operator[index]} `;
        }
    })

    operationsDisplay.textContent = display;
}


//Process the operation
function performOperation(){

    pushOperand();

    if(operand[0]===undefined && !operand[0]){
        clearAll();
        return;
    }

    displayOperation(operand);

    /*MDAS Iterations*/
    checkOperator("*");
    checkOperator("/");
    checkOperator("+");
    checkOperator("-");

    result = operand[0];
    resultDisplay.textContent = ((result===Infinity || result === -Infinity)?"Compute nicely":((result%1)?result.toFixed(2):result)); //sets the precision to 2 decimal numbers
    operator=[];
}

//Clear all operations
function clearAll(){
    operand = [];
    operandArray = [];
    operator = [];
    result = 0;
    operationsDisplay.textContent = "";
    resultDisplay.textContent = "0";
}


//The mathematical operations
function checkOperator(sign){
    while(operator.find(symbol => symbol == sign)){
        let x = operator.indexOf(sign);
        operand.splice(x,2,operate(operand[x],operand[x+1],sign))
        operator.splice(x,1);
    }
}


function operate(a,b,operator){
    let result;

    switch (operator) {
        case "+":
            result = add(a,b);
            break;
        case "-":
            result = subtract(a,b);
            break;
        case "*":
            result = multiply(a,b);
            break;
        case "/":
            result = divide(a,b);
            break;
        default:
            result = b;
            break;
    }

    return result;
}


function add(a,b){
    return (b === undefined)?a:a+b;
}

function subtract(a,b){
    return (b === undefined)?a:a-b;
}

function multiply(a,b){
    return (b === undefined)?a:a*b;
}

function divide(a,b){
    return (b === undefined)?a:a/b;

}

