const request = require("supertest");
const app = require("../app");

const BASE_URL = "/api/v1/users";

const user = {
  firstName: "astrid",
  lastName: "monfort",
  email: "astrid@gmail.com",
  password: "astrid198",
  phone: "123456789",
};

let TOKEN;
let userId;

beforeAll(async () => {
  const user = {
    email: "carlosdaniel@gmail.com",
    password: "carlos0702",
  };
  const res = await request(app).post(`${BASE_URL}/login`).send(user);
  //console.log(res.body)
  TOKEN = res.body.token;
});

test("Get -> BASE_URL, should return statuscode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("Post -> BASE_URL, should return status code 201, res.body.firstName ==== user.firstName", async () => {
  const res = await request(app).post(BASE_URL).send(user);

  userId = res.body.id;

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("Put -> BASE_URL/:id, should return statusCode 200, res.body.firstName ==== user.firstName", async () => {
  const bodyUpdate = {
    firstName: "astrid",
  };

  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(bodyUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(bodyUpdate.firstName);
});

test("Post -> BASE_URL/login, should return status code 200, res.body.user.email ==== user.email and res.body.token to be defined", async () => {
  const user = {
    email: "astrid@gmail.com",
    password: "astrid198",
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(user);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("Post -> BASE_URL/login, should return status code 401", async () => {
  const userInvalid = {
    email: "astrid@gmail.com",
    password: "bad",
  };

  const res = await request(app).post(`${BASE_URL}/login`).send(userInvalid);

  expect(res.statusCode).toBe(401);
});

test("Delete BASE_URL/:id, should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
