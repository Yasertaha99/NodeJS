سؤال ممتاز 👌
خلينا نفهم الفرق بين:

* `res.write()`
* `res.end()`
* `res.on()`
* و شوية حاجات قريبة منهم

في Node.js HTTP Server.

---

# 🔹 أولاً: `res.write()`

### وظيفته:

بيكتب جزء من البيانات في الـ response
لكن **ما بيقفلش الاتصال**

### مثال:

```ts
res.write("Hello ");
res.write("World");
res.end();
```

النتيجة:

```
Hello World
```

📌 تستخدمه لما:

* تبعتي البيانات على أجزاء (streaming)
* أو تبعتي response كبير

---

# 🔹 ثانياً: `res.end()`

### وظيفته:

* بيبعت آخر جزء من البيانات
* وبيقفل الـ response
* لازم يتنادي مرة واحدة في الآخر

### ممكن تبعتي بيانات جواه:

```ts
res.end("Done");
```

ده يعادل:

```ts
res.write("Done");
res.end();
```

📌 في أغلب الحالات بنستخدم `res.end()` مباشرة بدل write.

---

# 🔥 الفرق الأساسي

| res.write            | res.end                    |
| -------------------- | -------------------------- |
| يكتب جزء من البيانات | يكتب آخر جزء ويقفل الاتصال |
| ممكن يتنادي كذا مرة  | يتنادي مرة واحدة           |
| ماينهيش الـ response | ينهي الـ response          |

---

# 🔹 ثالثاً: `res.on()`

دي مختلفة خالص 👇

`res.on()` بنستخدمها عشان نسمع events
زي:

```ts
res.on("finish", () => {
  console.log("Response sent");
});
```

📌 معناها:
"لما يحصل حدث معين، نفذ الكود ده"

أشهر events:

* `"finish"` → لما الرد يخلص
* `"close"` → لو الاتصال اتقفل

---

# 🔹 طيب `req.on()` بقى؟

دي مهمة جداً 👇

```ts
req.on("data", chunk => {
  body += chunk;
});

req.on("end", () => {
  console.log(body);
});
```

ليه؟

لأن Node بيستقبل البيانات على أجزاء (chunks)
فلازم نجمعهم.

---

# 💡 ليه مش بنستخدم req.body زي Express؟

لأن Express فيه middleware جاهز
لكن http module الخام مفيهوش.

---

# 🎯 أفضل ممارسة في 90% من الحالات

بدل:

```ts
res.write(JSON.stringify(data));
res.end();
```

استخدمي:

```ts
res.end(JSON.stringify(data));
```

أبسط وأنضف.

---

# 🚀 ملخص سريع

* `res.write()` → اكتب جزء
* `res.end()` → انهي الرد
* `req.on("data")` → استقبل بيانات
* `req.on("end")` → البيانات خلصت
* `res.on("finish")` → الرد اتبعت

---
حلو 👌
يلا نعمل **رسمه ذهنية بسيطة** تشرح رحلة الـ Request جوه Node.js HTTP Server خطوة خطوة 💡

---

# 🧭 رحلة الـ Request في Node.js

```
Client (Browser / Postman)
        │
        ▼
  1️⃣ HTTP Request
        │
        ▼
  2️⃣ Node HTTP Server
        │
        ▼
  3️⃣ createServer Callback (req, res)
        │
        ▼
  4️⃣ req.on("data")
        │
        ▼
  5️⃣ req.on("end")
        │
        ▼
  6️⃣ Processing Logic (CRUD)
        │
        ▼
  7️⃣ res.write / res.end
        │
        ▼
  8️⃣ Response يرجع للـ Client
```

---

# 🧩 نشرح كل خطوة عملياً

## 1️⃣ Client يبعت Request

مثلاً:

```http
POST /users
```

مع JSON body.

---

## 2️⃣ السيرفر يستقبل الطلب

```ts
const server = http.createServer((req, res) => {
```

أول ما request يوصل
Node ينفذ الـ callback ده.

---

## 3️⃣ نفحص نوع الطلب

```ts
const method = req.method;
const url = req.url;
```

نعرف:

* GET؟
* POST؟
* PUT؟
* DELETE؟

---

## 4️⃣ لو فيه Body → Node يستقبله على أجزاء

```ts
let body = "";

req.on("data", (chunk) => {
  body += chunk.toString();
});
```

⚠️ ليه على أجزاء؟
لأن البيانات ممكن تكون كبيرة
فـ Node بيستقبلها stream.

---

## 5️⃣ لما البيانات تخلص

```ts
req.on("end", () => {
  const parsed = JSON.parse(body);
});
```

هنا بقى نقدر نستخدم البيانات بأمان.

---

## 6️⃣ نطبق منطق البرنامج (CRUD)

مثلاً:

```ts
users.push(parsed);
```

أو:

```ts
users.find(...)
```

---

## 7️⃣ نرجع Response

```ts
res.statusCode = 201;
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(newUser));
```

📌 `res.end()` لازم تتنادي
وإلا السيرفر هيفضل معلق.

---

# 🎬 الصورة الكاملة في كود صغير

```ts
http.createServer((req, res) => {

  if (req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {

      const data = JSON.parse(body);

      res.statusCode = 200;
      res.end(JSON.stringify({
        message: "Done",
        data
      }));

    });
  }

});
```

---

# 🔥 ملخص الرحلة في جملة واحدة

> Request يدخل → Node يجمع الـ body → ننفذ المنطق → نرجع response → الاتصال يتقفل.

---

# 🎯 أهم 3 نقاط لازم تفهميهم

1. Node بيشتغل Event-Driven
2. الـ body بييجي على chunks
3. لازم `res.end()` تتنادي

---

لو حابة أشرح لك الموضوع من منظور أعمق شوية
(إزاي الـ Event Loop بيشتغل في الموضوع ده 👀)

جميل 🔥
يلا ندخل مستوى أعمق شوية ونفهم **إزاي الـ Event Loop بيشتغل أثناء الـ HTTP request في Node.js**.

---

# 🧠 أولاً: Node.js Single Threaded… بس مش بسيط!

Node شغال بـ:

* Single Thread
* Non-Blocking I/O
* Event-Driven Architecture

يعني عنده Thread واحد بس
لكن بيعرف يخدم آلاف الطلبات في نفس الوقت 😎

السر هنا هو:

> 🔥 **Event Loop**

---

# 🎬 لما Request يوصل… إيه اللي بيحصل فعليًا؟

خلينا نمشي خطوة خطوة 👇

---

## 🟢 1️⃣ Client يبعت Request

الطلب يدخل على:

```ts
http.createServer((req, res) => {})
```

Node يسجل الحدث في الـ Event Loop.

---

## 🟢 2️⃣ Callback يتحط في Call Stack

```ts
(req, res) => {}
```

يتحط في:

> 📦 Call Stack

ويتبدأ التنفيذ.

---

## 🟢 3️⃣ لو فيه `req.on("data")`

هنا بقى النقطة المهمة 👇

```ts
req.on("data", chunk => {})
```

Node مش بيقف يستنى البيانات.

بدل كده:

* يسجل listener للحدث "data"
* يكمل تنفيذ باقي الكود
* لما البيانات توصل → يحط callback في الـ Event Queue

---

# 🔄 هنا بقى يشتغل الـ Event Loop

الـ Event Loop بيعمل الآتي:

```id="0u3q6b"
1️⃣ يشوف الـ Call Stack فاضي؟
2️⃣ آه → ياخد أول Event من الـ Queue
3️⃣ يدخله ينفذه في الـ Stack
4️⃣ يكرر العملية
```

---

# 🧩 مثال عملي

```ts
req.on("data", chunk => {
  body += chunk;
});

req.on("end", () => {
  res.end("Done");
});
```

## اللي بيحصل فعليًا:

1. يسجل listener للـ data
2. يسجل listener للـ end
3. يخرج من الكود
4. لما chunk يوصل → يتحط في queue
5. الـ Event Loop ينفذه
6. لما البيانات تخلص → event "end"
7. يتحط في queue
8. يتنفذ → `res.end()`

---

# 🎯 ليه ده مهم؟

لأن Node:

* مش بيقف يستنى I/O
* مش بيعمل blocking
* بيخلي السيرفر سريع جدًا

---

# 🧠 طب لو كان Blocking؟

تخيلي:

```ts
const data = fs.readFileSync("bigfile.txt");
```

ده هيوقف السيرفر كله 😬
لحد ما الملف يخلص.

لكن:

```ts
fs.readFile("bigfile.txt", (err, data) => {})
```

ده non-blocking
وبيستخدم نفس فكرة الـ Event Loop.

---

# 🧬 الشكل الداخلي للنظام

```id="k6m1pu"
Call Stack
    ▲
    │
Event Loop
    │
    ▼
Event Queue
```

---

# 💡 العلاقة بين HTTP و Event Loop

كل request بيبقى event.

Node بيسجل:

* request event
* data event
* end event
* finish event

وكلهم بيتحطوا في الـ Queue ويتنفذوا بالترتيب.

---

# 🔥 مثال يوضح الـ Non-Blocking

```ts
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");
```

النتيجة:

```id="qk8v2k"
Start
End
Timeout
```

ليه؟

لأن `setTimeout` بيتحط في Queue
وما يتنفذش غير لما الـ Stack يفضى.

---

# 🚀 أهم نقطة تفهميها

> Node سريع مش لأنه بيعمل شغل أكتر…
> لكن لأنه مش بيستنى حاجة تخلص 👌

---

# 🎓 ملخص احترافي

* Node = Single Thread
* I/O = Async
* Events بتتحط في Queue
* Event Loop ينفذهم لما الـ Stack يفضى
* مفيش Blocking إلا لو استخدمتي Sync code

---

لو تحبي أشرح لك الفرق بين:

* Event Loop
* Microtasks (Promises)
* Macrotasks (setTimeout)
* process.nextTick

وده مستوى أعلى شوية 👀



ممتاز 👌
دلوقتي هنشرح الفرق بين:

* **Event Loop**
* **Microtasks (Promises)**
* **Macrotasks (setTimeout)**
* **process.nextTick**
* * أمثلة عملية توضح التنفيذ بالترتيب

وهنركز على **Node.js** تحديدًا 👀

---

# 🧠 أولاً: Event Loop يعني إيه؟

الـ **Event Loop** هو النظام اللي بيخلي Node.js:

* يشتغل بـ Thread واحد
* ينفذ كود Async
* يدير الـ Call Stack و الـ Queues

هو ببساطة:

> منظم حركة التنفيذ بين الـ Stack و الـ Queues

---

# 🧩 أنواع الـ Queues في Node.js

عندنا نوعين رئيسيين:

## 1️⃣ Macrotask Queue

زي:

* `setTimeout`
* `setInterval`
* `setImmediate`
* HTTP events

## 2️⃣ Microtask Queue

زي:

* `Promise.then`
* `Promise.catch`
* `async/await`
* `queueMicrotask`

## 3️⃣ process.nextTick Queue (خاصة بـ Node)

دي ليها أولوية أعلى من الاتنين 👀

---

# 🏆 ترتيب الأولوية في Node.js

بعد ما الـ Call Stack يفضى، Node يمشي بالترتيب ده:

```
1️⃣ process.nextTick
2️⃣ Microtasks (Promises)
3️⃣ Macrotasks (setTimeout, setImmediate)
```

---

# 🎯 مثال عملي شامل

```js
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("End");
```

---

# 🧠 توقعي النتيجة قبل ما تشوفيها 👀

---

# ✅ النتيجة:

```
Start
End
nextTick
Promise
setTimeout
```

---

# 🔍 نشرح التنفيذ خطوة خطوة

## 1️⃣ ينفذ الـ Stack أولًا:

```
Start
End
```

---

## 2️⃣ بعد ما الـ Stack يفضى

Node يبدأ يفحص:

### ✔ process.nextTick أولًا

```
nextTick
```

---

### ✔ ثم Microtasks (Promises)

```
Promise
```

---

### ✔ ثم Macrotasks (setTimeout)

```
setTimeout
```

---

# 💡 الفرق بين Microtask و Macrotask

| النوع     | أمثلة        | أولوية |
| --------- | ------------ | ------ |
| Microtask | Promise.then | أعلى   |
| Macrotask | setTimeout   | أقل    |

---

# ⚠️ خطورة process.nextTick

لو عملتي recursion زي:

```js
function loop() {
  process.nextTick(loop);
}

loop();
```

السيرفر هيتجمد 💀
لأنه دايمًا بيشتغل قبل أي حاجة تانية.

---

# 🆚 setImmediate vs setTimeout

مثال:

```js
setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});
```

الترتيب مش دايمًا ثابت
بيعتمد على المرحلة اللي الـ Event Loop فيها.

لكن غالبًا في I/O callbacks
`setImmediate` بيشتغل قبل `setTimeout`.

---

# 🎬 الصورة الكبيرة للـ Event Loop

```
Call Stack
    ↓
process.nextTick Queue
    ↓
Microtask Queue
    ↓
Macrotask Queue
```

---

# 🚀 مثال أقوى يوضح كل حاجة

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

process.nextTick(() => console.log("4"));

console.log("5");
```

## الناتج:

```
1
5
4
3
2
```

---

# 🎓 خلاصة احترافية

* Node.js عنده Event Loop
* الكود العادي ينفذ في Call Stack
* بعد ما يخلص:

  * process.nextTick
  * Microtasks
  * Macrotasks
* Promises أسرع من setTimeout
* nextTick أسرع من الكل

---

# 🔥 اللغة المستخدمة

كل ده في:

> JavaScript داخل بيئة Node.js

لكن الفكرة نفسها موجودة في:

* المتصفح (Browser JS Engine)
* Deno
* Bun

الاختلاف بس في تفاصيل التنفيذ.

---

لو تحبي نرسم Timeline حقيقية توضح التنفيذ بالمللي ثانية 👀
أو أشرحلك الموضوع من منظور V8 Engine نفسه 🔥

جميل 🔥
يلا نعمل **Timeline حقيقية بالمللي ثانية** ونفهم اللي بيحصل جوه Node + V8 خطوة بخطوة 👀

---

# 🎯 المثال اللي هنشتغل عليه

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

process.nextTick(() => {
  console.log("D");
});

console.log("E");
```

---

# 🕒 Timeline حقيقية للتنفيذ

نفترض إن التنفيذ بدأ عند:

```text
⏱ 0ms
```

---

## 🟢 ⏱ 0ms — Call Stack يبدأ

### 1️⃣ console.log("A")

يتنفذ فورًا

```
Output: A
```

---

### 2️⃣ setTimeout(...)

Node يسجلها في **Timers Phase (Macrotask Queue)**
لكن ما ينفذهاش دلوقتي

---

### 3️⃣ Promise.resolve().then(...)

يتسجل في **Microtask Queue**

---

### 4️⃣ process.nextTick(...)

يتسجل في **nextTick Queue** (أعلى أولوية)

---

### 5️⃣ console.log("E")

```
Output: E
```

---

# 🔵 ⏱ بعد ما الـ Call Stack يفضى (~1ms)

Node يبدأ يشوف الـ Queues حسب الأولوية:

---

## 🥇 1️⃣ nextTick Queue

```
Output: D
```

---

## 🥈 2️⃣ Microtask Queue (Promises)

```
Output: C
```

---

## 🥉 3️⃣ Macrotask Queue (Timers)

Timer بتاع setTimeout جاهز

```
Output: B
```

---

# ✅ النتيجة النهائية

```
A
E
D
C
B
```

---

# 🎬 الشكل الزمني الكامل

```text
0ms   → A
0ms   → E
1ms   → D   (nextTick)
1ms   → C   (Promise Microtask)
2ms   → B   (setTimeout Macrotask)
```

---

# 🧠 طيب إيه علاقة V8 Engine بالكلام ده؟

Node = جزئين رئيسيين:

1️⃣ **V8 Engine**

* ينفذ JavaScript
* يدير Call Stack
* يدير Memory
* ينفذ Microtasks (Promises)

2️⃣ **libuv**

* يدير Event Loop
* يدير Timers
* يدير I/O
* يدير Thread Pool

---

# 🔥 الفرق المهم

| المسؤول | بيعمل إيه                    |
| ------- | ---------------------------- |
| V8      | ينفذ الكود + Microtasks      |
| libuv   | يدير Event Loop + Macrotasks |

---

# 🎯 ترتيب التنفيذ داخليًا

بعد كل Task يخلص:

1. V8 ينفذ كل Microtasks
2. Node ينفذ nextTick
3. Event Loop يكمل المرحلة التالية

---

# ⚠️ معلومة احترافية

Microtasks دايمًا تتنفذ بالكامل
قبل ما ننتقل لأي Macrotask

يعني:

```js
Promise.resolve().then(() => console.log(1));
Promise.resolve().then(() => console.log(2));
setTimeout(() => console.log(3), 0);
```

الناتج:

```
1
2
3
```

حتى لو Timer = 0

---

# 🚀 ملخص قوي

* Call Stack ينفذ الأول
* nextTick له أولوية مطلقة
* Promise أسرع من setTimeout
* V8 مسؤول عن JS execution
* libuv مسؤول عن Event Loop

---

لو حابة ندخل مستوى أعمق جدًا 👀🔥

نشرح:

* Phases بتاعة الـ Event Loop (Timers → Poll → Check...)
* الفرق بين setImmediate و setTimeout في كل Phase
* أو نعمل Simulation زي interview question

تحبي نكمل لأي مستوى؟ 😎


---
**CRUD باستخدام http server + TypeScript فقط** (من غير Express).

هشرح لك خطوة خطوة + كود نظيف تشتغلي بيه مباشرة.

---

# ✅ 1️⃣ تثبيت TypeScript

افتحي المشروع واكتبي:

```bash
npm init -y
npm install typescript @types/node --save-dev
npx tsc --init
```

في `tsconfig.json` تأكدي إن:

```json
{
  "target": "ES2020",
  "module": "commonjs",
  "rootDir": "./src",
  "outDir": "./dist",
  "strict": true
}
```

---

# ✅ 2️⃣ اعملي فولدر src وجواه ملف

```
src/index.ts
```

---

# ✅ 3️⃣ كود CRUD كامل بـ TypeScript

```ts
import http, { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

interface User {
  id: number;
  name: string;
}

let users: User[] = [
  { id: 1, name: "Ali" },
  { id: 2, name: "Sara" }
];

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {

    const parsedUrl = parse(req.url || "", true);
    const path = parsedUrl.pathname || "";
    const method = req.method;

    res.setHeader("Content-Type", "application/json");

    // ========================
    // GET ALL USERS
    // ========================
    if (method === "GET" && path === "/users") {
      res.end(JSON.stringify(users));
      return;
    }

    // ========================
    // GET ONE USER
    // ========================
    if (method === "GET" && path.startsWith("/users/")) {
      const id = Number(path.split("/")[2]);
      const user = users.find(u => u.id === id);

      if (!user) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "User not found" }));
        return;
      }

      res.end(JSON.stringify(user));
      return;
    }

    // ========================
    // CREATE USER
    // ========================
    if (method === "POST" && path === "/users") {

      let body = "";

      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const parsedBody = JSON.parse(body);

        const newUser: User = {
          id: users.length + 1,
          name: parsedBody.name
        };

        users.push(newUser);

        res.statusCode = 201;
        res.end(JSON.stringify(newUser));
      });

      return;
    }

    // ========================
    // UPDATE USER
    // ========================
    if (method === "PUT" && path.startsWith("/users/")) {

      let body = "";
      const id = Number(path.split("/")[2]);

      req.on("data", chunk => {
        body += chunk.toString();
      });

      req.on("end", () => {
        const parsedBody = JSON.parse(body);
        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "User not found" }));
          return;
        }

        users[index] = { ...users[index], ...parsedBody };

        res.end(JSON.stringify(users[index]));
      });

      return;
    }

    // ========================
    // DELETE USER
    // ========================
    if (method === "DELETE" && path.startsWith("/users/")) {

      const id = Number(path.split("/")[2]);
      const index = users.findIndex(u => u.id === id);

      if (index === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "User not found" }));
        return;
      }

      const deletedUser = users.splice(index, 1);

      res.end(JSON.stringify({
        message: "User deleted",
        data: deletedUser[0]
      }));

      return;
    }

    // Route not found
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
);

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
});
```

---

# ✅ 4️⃣ تشغيل المشروع

ضيفي في package.json:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsc -w"
}
```

ثم:

```bash
npm run build
npm start
```

أو أثناء التطوير:

```bash
npm run dev
```

---

# 🎯 مميزات استخدام TypeScript هنا

* عندك interface User
* Type checking
* Autocomplete
* أخطاء أقل
* كود منظم أكتر

---

لو تحبي أطور لك المثال ده لمستوى أعلى 👇

* Router منظم
* فصل Controllers
* Middleware
* Validation
* File DB
* MongoDB
* Clean Architecture

قوليلي إنتِ في مستوى إيه وأنا أظبطهولك حسب مستواكي 💙
