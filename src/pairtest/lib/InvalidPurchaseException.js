export class Error{
    #input;
    constructor(input){
        this.#input = input;
    }
        //if numOfTickets < 0 || NAN --> Error, invalid entry
        invalidInput(){
            if (!(Number.isInteger(this.#input))) {
                console.log("Must be a number");
            } 
            else if (this.#input <= 0) {
                console.log("Must be a positive number");
            }
        }
        //if numOfTickets > 20 --> Error, user can only purchase max 20 tickets
        purchaseLimit(){  
            if (!this.invalidInput()) {
                if (this.#input > 20) {
                    console.log("Maximum of 20 tickets!");
                }
            }
        }     
}


export default class InvalidPurchaseException extends Error {
    #typearr;
    constructor(typeArr, input){
        super(input);
        this.#typearr = typeArr;
    }
    validatePurchase(){
        return this.#typearr.includes("ADULT");
    }
}

