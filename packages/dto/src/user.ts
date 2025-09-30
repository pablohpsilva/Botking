import { User } from "@botking/artifact";
import { validateData, UserSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";

export class UserDto {
  public user?: User;

  constructor(props?: {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    id?: string;
  }) {
    if (props) {
      this.user = new User(props);
    }
  }

  public async findById(id: string): Promise<UserDto> {
    this.user = (await connectionManager.getClient().user.findUnique({
      where: { id },
    })) as User;
    return this;
  }

  public validate(): UserDto {
    const result = validateData(UserSchema, this.user);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<UserDto> {
    this.validate();

    if (!this.user) {
      throw new Error("User pack is not allowed to be set");
    }

    await connectionManager.getClient().user.upsert({
      where: { id: this.user.id },
      update: this.user,
      create: this.user,
    });

    return this;
  }
}
