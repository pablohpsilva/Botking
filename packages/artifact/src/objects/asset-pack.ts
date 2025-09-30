export class AssetPack {
  public id: string;
  public name: string;
  public version: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id?: string;
    name: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? "";
    this.name = props.name;
    this.version = props.version;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
