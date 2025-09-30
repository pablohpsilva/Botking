export class User {
  public id: string;
  public name: string;
  public email: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    id?: string;
  }) {
    this.id = props.id ?? "";
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
