import { item_class } from "@botking/db";

export class Template {
  public id: string;
  public itemClass: item_class;
  public name: string;
  public slug: string;
  public meta: Record<string, any>;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id?: string;
    itemClass: item_class;
    name: string;
    slug: string;
    meta: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.itemClass = props.itemClass;
    this.name = props.name;
    this.slug = props.slug;
    this.meta = props.meta;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
