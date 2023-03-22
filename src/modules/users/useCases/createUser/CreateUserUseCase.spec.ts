import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

let usersRepository: IUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
  });

  it("should be able to create a new user", async () => {
    const user = await usersRepository.create({
      name: "User Test",
      email: "user@email.com",
      password: "1234",
    });

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty("id");
  });
});
