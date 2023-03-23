import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoInMemory, userRepositoryInMemory);
  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as any,
      amount: 100,
      description: "Statement test",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance.balance).toBe(100);
    expect(balance.statement.length).toBe(1);
  });

  it("should not be able to get balance of a non-existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existent-user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
