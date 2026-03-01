const http = require('http');
const url = require('url');

let users = [
  { id: 1, name: "Ali", age: 30 },
  { id: 2, name: "Sara", age: 25 },
  { id: 3, name: "Ahmed", age: 35 },  
  { id: 4, name: "Lina", age: 28 },
  { id: 5, name: "Omar", age: 32 }
];

const server = http.createServer((req, res) => {

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  // =========================
  // GET - Read All Users
  // =========================
  if (method === 'GET' && path === '/users') {
    return res.end(JSON.stringify(users));
  }

  // =========================
  // GET - Read One User
  // =========================
  if (method === 'GET' && path.startsWith('/users/')) {
    const id = parseInt(path.split('/')[2]);
    const user = users.find(u => u.id === id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    return res.end(JSON.stringify(user));
  }

  // =========================
  // POST - Create User
  // =========================
  if (method === 'POST' && path === '/users') {

    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newUser = JSON.parse(body);

      newUser.id = users.length + 1;
      users.push(newUser);

      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    });

    return;
  }

  // =========================
  // PUT - Update User
  // =========================
  if (method === 'PUT' && path.startsWith('/users/')) {

    let body = '';
    const id = parseInt(path.split('/')[2]);

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedData = JSON.parse(body);
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "User not found" }));
      }

      users[userIndex] = { ...users[userIndex], ...updatedData };

      res.end(JSON.stringify(users[userIndex]));
    });

    return;
  }

  // =========================
  // DELETE - Delete User
  // =========================
  if (method === 'DELETE' && path.startsWith('/users/')) {

    const id = parseInt(path.split('/')[2]);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const deletedUser = users.splice(userIndex, 1);

    res.end(JSON.stringify({
      message: "User deleted",
      data: deletedUser[0]
    }));

    return;
  }

  // If route not found
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Route not found" }));

});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});

