import { IdentityLink, User } from "@botking/artifact";
import { validateData, IdentityLinkSchema } from "@botking/validator";
import { connectionManager } from "@botking/db";
import { UserDto } from "./user";

// Define loading options type
type IdentityLinkLoadOptions = {
  includeUser?: boolean;
};

export class IdentityLinkDto {
  public identityLink?: IdentityLink;
  public user?: UserDto;

  constructor(props?: {
    id?: string;
    authUserId: string;
    globalPlayerId: string;
    linkedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.identityLink = new IdentityLink(props);
    }
  }

  /**
   * Find identity link by ID with optional relationship loading
   * @param id Identity Link ID
   * @param options Loading options for relationships
   */
  public async findById(
    id: string,
    options: IdentityLinkLoadOptions = {}
  ): Promise<IdentityLinkDto> {
    // Build include object dynamically
    const include: any = {};

    if (options.includeUser) {
      include.user = true;
    }

    const dbResult = await connectionManager
      .getClient()
      .identity_link.findUnique({
        where: { id },
        include: Object.keys(include).length > 0 ? include : undefined,
      });

    if (dbResult) {
      this.identityLink = new IdentityLink({
        id: dbResult.id,
        authUserId: dbResult.userId,
        globalPlayerId: dbResult.globalPlayerId,
        linkedAt: dbResult.linkedAt,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate user if included
      if (options.includeUser && dbResult.user) {
        this.user = new UserDto();
        this.user.user = dbResult.user as User;
      }
    }
    return this;
  }

  /**
   * Convenience methods for common use cases
   */
  public async findByIdBasic(id: string): Promise<IdentityLinkDto> {
    return this.findById(id, {});
  }

  public async findByIdWithUser(id: string): Promise<IdentityLinkDto> {
    return this.findById(id, { includeUser: true });
  }

  /**
   * Lazy loading method for user relationship
   */
  public async loadUser(): Promise<void> {
    if (!this.identityLink?.authUserId || this.user) return;

    this.user = await new UserDto().findById(this.identityLink.authUserId);
  }

  /**
   * Static method for batch loading with relationships
   */
  public static async findManyWithOptions(
    where: any,
    options: IdentityLinkLoadOptions = {},
    pagination?: { skip?: number; take?: number }
  ): Promise<IdentityLinkDto[]> {
    const include: any = {};

    if (options.includeUser) include.user = true;

    const dbResults = await connectionManager
      .getClient()
      .identity_link.findMany({
        where,
        include: Object.keys(include).length > 0 ? include : undefined,
        skip: pagination?.skip,
        take: pagination?.take,
      });

    return dbResults.map((dbResult) => {
      const dto = new IdentityLinkDto();

      dto.identityLink = new IdentityLink({
        id: dbResult.id,
        authUserId: dbResult.userId,
        globalPlayerId: dbResult.globalPlayerId,
        linkedAt: dbResult.linkedAt,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
      });

      // Populate user if included
      if (options.includeUser && dbResult.user) {
        dto.user = new UserDto();
        dto.user.user = dbResult.user as User;
      }

      return dto;
    });
  }

  public validate(): IdentityLinkDto {
    const result = validateData(IdentityLinkSchema, this.identityLink);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<IdentityLinkDto> {
    this.validate();

    if (!this.identityLink) {
      throw new Error("Identity link is not allowed to be set");
    }

    const dbData = {
      id: this.identityLink.id,
      userId: this.identityLink.authUserId,
      globalPlayerId: this.identityLink.globalPlayerId,
      linkedAt: this.identityLink.linkedAt,
      createdAt: this.identityLink.createdAt,
      updatedAt: this.identityLink.updatedAt,
    };

    await connectionManager.getClient().identity_link.upsert({
      where: { id: this.identityLink.id },
      update: dbData,
      create: dbData,
    });

    return this;
  }
}
