const express = require ('express');
const app = express();
const port=3000;
// Middleware to parse JSON bodies
app.use(express.json());
let users = [
  { id: 1, name: "Ali", age: 30 },
  { id: 2, name: "Sara", age: 25 },
  { id: 3, name: "Ahmed", age: 35 },
  { id: 4, name: "Lina", age: 28 },
  { id: 5, name: "Omar", age: 32 }
]; 

app.get('/', (req, res , next) => {
  res.send({"MASSAGE":"list all users","code":200,"data":users});
});
app.get('/:id',(req,res,next)=>{
    const userId = parseInt(req.params.id); // Extract id from URL
    const user =users[userId-1];
   console.log(user);
    
    res.send({"show one  User ID is":userId,'user':user});
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/**
 * Checks if a value is a valid finite number
 * @param {*} value - The value to check
 * @returns {boolean} - true if value is a number, false otherwise
 */
function isValidNumber(value) {
    // First, ensure the type is number OR a numeric string
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value === 'string' && value.trim() !== '') {
        // Try converting to number
        const num = Number(value);
        return Number.isFinite(num);
    }
    return false;
}