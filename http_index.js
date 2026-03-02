const http = require('http');
const fs = require('fs');
const path = require('path');


let users = [
  { id: 1, name: "Ali", age: 30 },
  { id: 2, name: "Sara", age: 25 },
  { id: 3, name: "Ahmed", age: 35 },
  { id: 4, name: "Lina", age: 28 },
  { id: 5, name: "Omar", age: 32 }
];

const server = http.createServer((req, res) => {

  let { url, method } = req
  res.setHeader('Content-Type', 'application/json');
  console.log(`url : ${url}`, `=>    method: ${method}`)
  if (url == '/' && method == 'GET') {
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
  // =========================
  // GET - Read All Users
  // =========================
  if (url == '/users' && method == 'GET') {
    res.write(JSON.stringify(users));
    res.end();
  }
  // =========================
  // POST - create new Users
  // ========================= 
  if (url === '/users' && method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk; // accumulate chunks as string
    });
    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        console.log(user);
        users.push(user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  }
  // =========================
  // GET - Read One User
  // =========================
  else if (url.startsWith('/users/') && method === 'GET') {

    const parts = url.split('/'); // ['','users','123']
    const id = parseInt(parts[2]); //  this is  id
    const user = users.find(u => u.id === id);
    console.log('User ID:', id, 'User:', user);

    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`User: ${JSON.stringify(user)}`);
  }
  // =========================
  // PUT - Read One User and update
  // =========================
  else if (url.startsWith('/users/') && method === 'PUT') {

  const id = Number(url.split('/')[2]); 
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {

    const updatedData = JSON.parse(body);

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updatedData
    };

    console.log(users);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users[userIndex]));
  });
}
   // =========================
  // Delate - Destory One User
  // =========================
  else if(url.startsWith('/user/') && method=='DELETE'){
     const id = parseInt(url.split('/')[2]); 
       const userIndex = users.findIndex(u => u.id === id);
       console.log(userIndex);
       
    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: "User not found" }));
    }
    users.splice(userIndex,1)
  console.log(users);
   res.end(JSON.stringify({
      message: "User deleted",
      data: deletedUser[0]
    }));

    return;
  }

});


// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}/`);
// });

server.listen(3000, () => {
  console.log(`Server is running at http://localhost:${server.address().port}/`);
});