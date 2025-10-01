import { User, IdentityLink } from "@botking/artifact";
import { validateData, UserSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { IdentityLinkDto } from "./identity-link";

// Define loading options type
type UserLoadOptions = {
  includeIdentityLinks?: boolean;
};

export class UserDto {
  public user?: User;
  public identityLinks?: IdentityLinkDto[];

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

  /**
   * Find user by ID with optional relationship loading
   * @param id User ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: UserLoadOptions = {}
  ): Promise<UserDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeIdentityLinks) {
      include.links = true;
    }

    const dbResult = await connectionManager.getClient().user.findUnique({
      where: { id },
      include: Object.keys(include).length > 0 ? include : undefined,
    });

    if (dbResult) {
      this.user = new User({
        name: (dbResult as any).name || "",
        email: (dbResult as any).email || "",
        createdAt: (dbResult as any).createdAt,
        updatedAt: (dbResult as any).updatedAt,
        id: (dbResult as any).id,
      });

      // Populate identity links if included
      if (options.includeIdentityLinks && dbResult.links) {
        this.identityLinks = dbResult.links.map((link) => {
          const dto = new IdentityLinkDto();
          dto.identityLink = new IdentityLink({
            id: link.id,
            authUserId: link.userId,
            globalPlayerId: link.globalPlayerId,
            linkedAt: link.linkedAt,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt,
          });
          return dto;
        });
      }
    }
    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<UserDto> {
    return this.findById(id, {});
  }

  public async findByIdWithLinks(id: string): Promise<UserDto> {
    return this.findById(id, { includeIdentityLinks: true });
  }

  /**
   * Lazy loading method for identity links relationship
   */
  public async loadIdentityLinks(): Promise<void> {
    if (!this.user?.id || this.identityLinks) return;

    const links = await connectionManager.getClient().identity_link.findMany({
      where: { userId: this.user.id },
    });

    this.identityLinks = links.map((link) => {
      const dto = new IdentityLinkDto();
      dto.identityLink = new IdentityLink({
        id: link.id,
        authUserId: link.userId,
        globalPlayerId: link.globalPlayerId,
        linkedAt: link.linkedAt,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      });
      return dto;
    });
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: UserLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<UserDto[]> {
    const include: any = {};

    if (options.includeIdentityLinks) include.links = true;

    const dbResults = await connectionManager.getClient().user.findMany({
      where,
      include: Object.keys(include).length > 0 ? include : undefined,
      skip: pagination?.skip,
      take: pagination?.take,
    });

    return dbResults.map((dbResult) => {
      const dto = new UserDto();

      dto.user = new User({
        name: (dbResult as any).name || "",
        email: (dbResult as any).email || "",
        createdAt: (dbResult as any).createdAt,
        updatedAt: (dbResult as any).updatedAt,
        id: (dbResult as any).id,
      });

      // Populate identity links if included
      if (options.includeIdentityLinks && dbResult.links) {
        dto.identityLinks = dbResult.links.map((link) => {
          const linkDto = new IdentityLinkDto();
          linkDto.identityLink = new IdentityLink({
            id: link.id,
            authUserId: link.userId,
            globalPlayerId: link.globalPlayerId,
            linkedAt: link.linkedAt,
            createdAt: link.createdAt,
            updatedAt: link.updatedAt,
          });
          return linkDto;
        });
      }

      return dto;
    });
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
