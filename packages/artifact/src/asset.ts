import { asset_kind } from "@botking/db";

export class Asset {
  public id: string;
  public packId: string;
  public kind: asset_kind;
  public url: string;
  public width: number;
  public height: number;
  public variant: string;
  public meta: Record<string, any>;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id?: string;
    packId: string;
    kind: asset_kind;
    url: string;
    width: number;
    height: number;
    variant: string;
    meta: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.packId = props.packId;
    this.kind = props.kind;
    this.url = props.url;
    this.width = props.width;
    this.height = props.height;
    this.variant = props.variant;
    this.meta = props.meta;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
