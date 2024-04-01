
const isBigger = (string1, string2) => {
    // function to determine if string1 is bigger than string2 which is necessary operating on bigint numbers
    if(string1.length > string2.length){
        return true;
    }
    else if(string2.length > string1.length){
        return false;
    }
    else {
        for(let i = 0; i < string1.length; i++) {   // comparing each digit until a different digit is found or come to the end of the string
            if(string1[i] > string2[i]){
                return true;
            }
            if(string1[i] < string2[i]){ 
                return false;
            }
    }}
    return false;
}
const prepare = (string1, string2) => {
    // function to prepare both strings to arithmetic operations
    // adding zeros in the beginning of a string to make both strings same length
    if(string1.length>string2.length)
    {
        const difference = string1.length - string2.length
        string2 = "0".repeat(difference).concat(string2)    
    }
    else {
        const difference = string2.length - string1.length
        string1 = "0".repeat(difference).concat(string1)
    }
    return [string1,string2]
} 
const floor = (string1) => {
    // floor function using regex
    return string1.replace(/\..+/,"")
}

Object.defineProperty(String.prototype, "plus", {
    value: function (string) {
    // function to add numbers in both strings based on the column method
    let result = "" 
    let nextDigit = "0" 
    const preparedStrings = prepare(this,string)
    for (let i = preparedStrings[0].length-1; i>-1; i--){
        let sum = (+nextDigit + (+preparedStrings[0][i] + +preparedStrings[1][i])) // adding two digits and the digit from previous column
        result = String(sum % 10).concat(result) // checking if the sum is bigger than 10 
        nextDigit = floor(String(sum/10)) // adding additional tens to the next digit 
    }
    return nextDigit !=0 ? String(nextDigit).concat(result) : result
    },
});

Object.defineProperty(String.prototype, "minus", {
    value: function (string) {
        // function to subtract numbers in both strings based on the column method
        if(!isBigger(this,string)){ // checking if the first string is bigger than the second string                                                                                                                                       
            throw new Error("Number in the first string must be larger than number in second string")
        }
        let result = ""
        let borrowDigit = "0"
        const preparedStrings = prepare(this,string)
        for (let i = this.length-1; i>-1; i--){
            let difference = (+preparedStrings[0][i] - (+preparedStrings[1][i])) - (+borrowDigit) // subtracting two digits and the borrowed digit
            if(difference < 0){ // checking if the sum is lower than 0 
                result = String(difference + 10).concat(result)
                borrowDigit = "1" // adding 10 to the result and subtracting 1 from the next digit
            } 
            else{
                result = String(difference).concat(result)
                borrowDigit = "0"
            }
        }
        return result[0] === "0" ? result.replace(/^0+/, '') : result // removing zeros from the beginning of the result
        },
});

Object.defineProperty(String.prototype, "multiply", {
    value: function (string) {
        // function to multiply numbers in both strings based on the column method
        let result = ""
        let nextDigit = "0" 
        for (let i = string.length -1 ; i>=0; i--){
            let singleResult = "0".repeat(string.length-1-i) // result of multiplication one number by one digit of second number plus a 0 increasing with every row of the operation
            for(let j = this.length -1; j>=0; j--)
            {
                let product = +this[j]*+string[i] + +nextDigit // multiplying two digits and adding the digit from the previous column
                singleResult = String(product % 10).concat(singleResult) // adding the product to the singleresult 
                nextDigit = floor(String(product/10))   // adding the tens to the next column
            }
            if(nextDigit > 0){
                singleResult = nextDigit.concat(singleResult)   // adding the next digit at the end of the row
                nextDigit = "0";
            }
            result = result.plus(singleResult)  // adding the single result to the full result
        }
        return result[0] === "0"? "0" : result // returning one 0 if the result is 0
        },
});

Object.defineProperty(String.prototype, "divide", {
    value: function (string) {
        // function operates on subtracting the second string from the first string and counting how many subtractions there are until the number in the first string reaches zero
        let result = "0"
        let dividend = this.plus("1") // 1 is added to the dividend because the function String.minus doesn't allow to subtract both exact numbers
                                      // it has no effect on the result whatsoever when opetating on positive integers
        let divisor = string          // second string is the divisor in the beginning
        let multiplier = "1"
        // whole function is an accelerated version of the division by counting subtractions
        // since operating on bigint numbers, it wouldn't be possible to get results in the acceptable amount of time
            try{                                            
                while(dividend.minus(string)) {                     // if the difference isn't lower than 1, the divisor and the multiplier is multiplied by 2 at every iteration of the while loop 
                    try {
                        while(dividend.minus(divisor)){
                            dividend = dividend.minus(divisor)      // subtracting divisor from the dividend
                            result = result.plus(multiplier)        // adding the value of the multiplier to the result
                            multiplier = multiplier.multiply("2")   // multiplying the multiplier by 2
                            divisor = divisor.multiply("2")         // multiplying the divisor by 2                       
                        }
                    }
                    catch (err) {                           // if the difference is lower than 1, the multiplier is set back to 1 and the divisor is set back to the default second string
                       multiplier = "1"
                       divisor = string                       
                    }
                }
            }
            catch (err) {
                return result
            }        
        }
    }
)

