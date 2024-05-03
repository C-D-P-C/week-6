require("../models");

const request = require("supertest");
const app = require("../app");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const BASE_URL = "/api/v1/purchase";

let TOKEN;
let productId;
let productBody;
let product;
let cart;
let userId;
let cartBody;
let purchase;

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
    title: "iphone test",
    description: "iphone description",
    price: 3.34,
  };

  product = await Product.create(productBody);

  cartBody = {
    quantity: 3,
    productId: product.id,
  };

  await request(app)
    .post("/api/v1/cart")
    .send(cartBody)
    .set("Authorization", `Bearer ${TOKEN}`);
});

test("Post -> BASE_URL, should return status code 201, res.body[0].quantity ==== purchase.quantity", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.statusCode).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body[0].quantity).toBe(cartBody.quantity);
});

test("Get -> BASE_URL, should return statuscode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);

  expect(res.body[0].userId).toBeDefined();
  expect(res.body[0].userId).toBe(userId);

  expect(res.body[0].product).toBeDefined();
  expect(res.body[0].product.id).toBe(product.id);

  await product.destroy();
});
