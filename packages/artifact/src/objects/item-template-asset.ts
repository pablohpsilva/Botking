export class ItemTemplateAsset {
  public id: string;
  public itemTplId: string;
  public assetId: string;
  public primary: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    id: string;
    itemTplId: string;
    assetId: string;
    primary: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.itemTplId = props.itemTplId;
    this.assetId = props.assetId;
    this.primary = props.primary;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
