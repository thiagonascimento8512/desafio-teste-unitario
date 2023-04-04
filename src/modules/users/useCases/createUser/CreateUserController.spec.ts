import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let connection: Connection;
let createUserUseCase: CreateUserUseCase;

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    createUserUseCase = new CreateUserUseCase(new UsersRepository());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "User Example",
      email: "user@email.com",
      password: "1234",
    }

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with an email that already exists", async () => {
    const user = {
      name: "User Example",
      email: "user@email.com",
      password: "1234",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
