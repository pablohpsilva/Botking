import { Template } from "@botking/artifact";
import { validateData, TemplateSchema } from "@botking/validator";
import { connectionManager, item_class } from "@botking/db";

export class TemplateDto {
  public template?: Template;

  constructor(props?: {
    id?: string;
    itemClass: item_class;
    name: string;
    slug: string;
    meta: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    if (props) {
      this.template = new Template(props);
    }
  }

  public async findById(id: string): Promise<TemplateDto> {
    this.template = (await connectionManager.getClient().template.findUnique({
      where: { id },
    })) as Template;
    return this;
  }

  public validate(): TemplateDto {
    const result = validateData(TemplateSchema, this.template);

    if (!result.success) {
      throw new Error(result.error);
    }

    return this;
  }

  public async upsert(): Promise<TemplateDto> {
    this.validate();

    if (!this.template) {
      throw new Error("Template pack is not allowed to be set");
    }

    await connectionManager.getClient().template.upsert({
      where: { id: this.template.id },
      update: this.template,
      create: this.template,
    });

    return this;
  }
}
