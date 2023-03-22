import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    const user_id = user.id as string;

    const userCreated = await showUserProfileUseCase.execute(user_id);

    expect(userCreated).toHaveProperty("id");
    expect(userCreated.id).toEqual(user_id);
  });

  it("should not be able to show user profile if user does not exists", async () => {
    expect(async () => {
      const user_id = "1234";

      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
