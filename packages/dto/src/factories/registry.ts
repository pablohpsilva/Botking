import { ArtifactDTOFactory } from "./base/artifact-dto-factory";

// Import core lean factories
import { BotDTOFactory } from "./artifact/bot-factory";
import { ItemDTOFactory } from "./inventory/item-factory";

/**
 * Lean DTO Factory Registry
 *
 * Simplified registry for artifact-first factories
 */
export class DTOFactoryRegistry {
  private static factories = new Map<string, ArtifactDTOFactory<any, any>>();

  public static register<TArtifact, TDTO>(
    key: string,
    factory: ArtifactDTOFactory<TArtifact, TDTO>
  ): void {
    this.factories.set(key, factory);
  }

  public static get<TArtifact, TDTO>(
    key: string
  ): ArtifactDTOFactory<TArtifact, TDTO> | undefined {
    return this.factories.get(key);
  }

  public static initialize(): void {
    // Register core artifact factories (lean approach)
    this.register("bot", new BotDTOFactory());
    this.register("item", new ItemDTOFactory());
  }

  public static list(): string[] {
    return Array.from(this.factories.keys());
  }

  public static clear(): void {
    this.factories.clear();
  }
}
