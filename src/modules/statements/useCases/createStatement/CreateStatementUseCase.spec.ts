import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatemensRepository: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(async () => {
    inMemoryStatemensRepository = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, inMemoryStatemensRepository);


  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as any,
      amount: 100,
      description: "Statement test",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "non-existent-user",
        type: 'deposit' as any,
        amount: 100,
        description: "Statement test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: 'withdraw' as any,
        amount: 100,
        description: "Statement test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
