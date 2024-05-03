require("../models");

const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

const BASE_URL = "/api/v1/cart";
let TOKEN;
let productId;
let productBody;
let product;
let cart;
let userId;
let cartId;

beforeAll(async () => {
  const user = {
    email: "carlosdaniel@gmail.com",
    password: "carlos0702",
  };
  const res = await request(app).post(`/api/v1/users/login`).send(user);
  //console.log(res.body)
  TOKEN = res.body.token;
  userId = res.body.user.id;
  productBody = {
    title: "campera",
    description: "campera para invierno temporada 2024",
    price: 34.45,
  };
  product = await Product.create(productBody);
});

test("Post -> BASE_URL, should return status code 201, res.body.quantity ==== cart.quantity", async () => {
  cart = {
    quantity: 5,
    productId: product.id,
  };
  const res = await request(app)
    .post(BASE_URL)
    .send(cart)
    .set("Authorization", `Bearer ${TOKEN}`);

  cartId = res.body.id;
  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cart.quantity);
});

test("Get -> BASE_URL, should return statuscode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("Get -> BASE_URL/:id, should return statusCode 200, and res.body.quantity ==== cart.quantity", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cart.quantity);
});

test("Put -> BASE_URL/songId, should return statusCode 200, res.body.quantity ==== bodyUpdate.quantity", async () => {
  const bodyUpdate = {
    quantity: 5,
  };

  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .send(bodyUpdate)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(bodyUpdate.quantity);
});

test("Delete BASE_URL/:id, should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await product.destroy();
});
