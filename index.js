const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

let users = [
  { id: 1, name: "Ali", age: 30 },
  { id: 2, name: "Sara", age: 25 },
  { id: 3, name: "Ahmed", age: 35 },  
  { id: 4, name: "Lina", age: 28 },
  { id: 5, name: "Omar", age: 32 }
];

const server= http.createServer((req,res)=>{
    
    let {url,method}= req

    console.log(`url : ${url}`, `=>    method: ${method}`)
    if(url=='/'&& method=='GET'){
        const filePath = path.join(__dirname, 'public', 'welcame.html');
console.log(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
        // res.write(JSON.stringify(users));
        // res.end();
    }
    if(url=='/users'&& method=='GET'){
        res.write(JSON.stringify(users));
        res.end();
    }

});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
// server.listen(3000, () => {
//   console.log(`Server is running at http://localhost:${server.address().port}/`);
// });