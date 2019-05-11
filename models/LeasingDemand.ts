import {
  AllowNull, Column, CreatedAt,
  DeletedAt, Model, Table, UpdatedAt, DefaultScope, Scopes, BelongsTo, ForeignKey
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
export class LeasingDemand extends Model<LeasingDemand> {

  @AllowNull(false)
  @Column
  public airport: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Car)
  @Column
  carId: number;

  @BelongsTo(() => Car)
  car: Car;

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
