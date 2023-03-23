import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Balance", () => {
  beforeEach(async () => {
    statementRepositoInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoInMemory);
  });

  it("should be able to get balance", async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to get balance from a non-existent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: "123",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get balance from a non-existent statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "123",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
