import {
  AllowNull, BelongsTo, Column,
  CreatedAt, DefaultScope, DeletedAt, ForeignKey, HasOne, Model, Scopes, Table, UpdatedAt, HasMany
} from "sequelize-typescript";
import { LeasingDemand } from "./LeasingDemand";
import { RentingDemand } from "./RentingDemand";
import { User } from "./User";

@DefaultScope(() => ({
  attributes: ["id", "firstCirculationDate", "manufacturer", "model", "fuelType", "pricePerDay", "fromDate",
    "toDate"],
}))
@Scopes(() => ({
  full: {
    include: [{ all: true }],
  },
}))

@Table
export class Car extends Model<Car> {

  @AllowNull(false)
  @Column
  public firstCirculationDate: Date;

  @AllowNull(false)
  @Column
  public manufacturer: string;

  @AllowNull(false)
  @Column
  public model: string;

  @Column
  public fuelType: string;

  @Column
  public pricePerDay: number;

  @Column
  public fromDate: Date;

  @Column
  public toDate: Date;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User, "userId")
  public user: User;

  @HasOne(() => LeasingDemand, "carId")
  public rentee: LeasingDemand;

  @HasMany(() => RentingDemand, "carId")
  public renters: RentingDemand[];

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
