require("../models");

const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");

const BASE_URL = "/api/v1/products";

let TOKEN;
let productId;
let category;
let product;

beforeAll(async () => {
  const user = {
    email: "carlosdaniel@gmail.com",
    password: "carlos0702",
  };
  const res = await request(app).post(`/api/v1/users/login`).send(user);
  //console.log(res.body)
  TOKEN = res.body.token;

  category = await Category.create({ name: "Tecno" });

  product = {
    title: "campera",
    description: "campera para invierno temporada 2024",
    price: 34.45,
    categoryId: category.id,
  };
});

test("Post -> BASE_URL, should return status code 201, res.body.title ==== product.title", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("Get -> BASE_URL, should return statuscode 200, and res.body.length === 1", async () => {
  const res = await request(app).get(BASE_URL);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("Get -> BASE_URL/:id, should return statusCode 200, and res.body.title ==== product.title", async () => {
  const res = await request(app).get(`${BASE_URL}/${productId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("Put -> BASE_URL/songId, should return statusCode 200, res.body.title === bodyUpdate.title", async () => {
  const bodyUpdate = {
    title: "casaca",
  };

  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .send(bodyUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(bodyUpdate.title);
});

test("Delete BASE_URL/:id, should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await category.destroy();
});
