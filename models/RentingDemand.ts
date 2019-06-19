import {
  AllowNull, BelongsTo, Column,
  CreatedAt, DefaultScope, DeletedAt, ForeignKey, Model, Scopes, Table, UpdatedAt
} from "sequelize-typescript";
import { Car } from "./Car";
import { User } from "./User";

@DefaultScope({
  attributes: ["id", "airport"]
})
@Scopes({
  full: {
    include: [() => Car, () => User]
  },
})

@Table
export class RentingDemand extends Model<RentingDemand> {

  @Column
  public driverLicenseId: string;

  @Column
  public driverLicenseDateOfIssue: string;

  @Column
  public airport: string;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @ForeignKey(() => Car)
  @Column
  public carId: number;

  @BelongsTo(() => Car)
  public car: Car;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt: Date;

  @DeletedAt
  @Column
  public deletedAt: Date;
}
