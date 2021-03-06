import { Optional } from "sequelize";
import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
} from "sequelize-typescript";

interface IContactAttributes {
  id: number;
  owner: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  age: number;
  avatar: string;
  linkToWebsite: string;
  tags: string;
}

interface IContactCreationAttributes
  extends Optional<IContactAttributes, "id"> {}

@Table
class Contact extends Model<IContactAttributes, IContactCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  owner: string;

  @Column
  name: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  phoneNumber: string;

  @Column
  age: number;

  @Column
  avatar: string;

  @Column
  linkToWebsite: string;

  @Column(DataType.STRING)
  tags: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}

export default Contact;
