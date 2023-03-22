import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatemensRepository: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatemensRepository = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, inMemoryStatemensRepository);
  });

  it("should be able to create a new statement", async () => {
  });
});
