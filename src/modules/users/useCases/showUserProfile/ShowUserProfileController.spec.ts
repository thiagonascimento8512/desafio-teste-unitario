import { Connection, createConnection } from "typeorm";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UsersRepository } from "../../repositories/UsersRepository";
import { ShowUserProfileController } from "./ShowUserProfileController";
import request from "supertest";
import { app } from "../../../../app";


let connection: Connection;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    createUserUseCase = new CreateUserUseCase(new UsersRepository());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show an user profile", async () => {
    const user = {
      name: "User Example",
      email: "user@email.com",
      password: "1234",
    }

    const userCreated = await createUserUseCase.execute(user);

    const authenticateUser = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const response = await request(app)
      .get(`/api/v1/profile`)
      .set('Authorization', `Bearer ${authenticateUser.body.token}`);

    expect(response.status).toBe(200);
  });
});
