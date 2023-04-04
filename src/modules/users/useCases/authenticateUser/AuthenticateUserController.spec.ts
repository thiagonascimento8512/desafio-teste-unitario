import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { UsersRepository } from "../../repositories/UsersRepository";
import { app } from "../../../../app";

let connection: Connection;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    createUserUseCase = new CreateUserUseCase(new UsersRepository());
    authenticateUserUseCase = new AuthenticateUserUseCase(new UsersRepository());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "User Example",
      email: "user@email.com",
      password: "1234",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user3@email.com",
      password: "1234",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "12345",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

});
