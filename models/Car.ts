import {
  AllowNull, Column, CreatedAt,
  DeletedAt, Model, Table, UpdatedAt, DefaultScope, Scopes, BelongsTo, ForeignKey, HasOne
} from "sequelize-typescript";
import { RentingDemand } from "./RentingDemand";
import { LeasingDemand } from "./LeasingDemand";

@DefaultScope({
  attributes: ["id", "firstCirculationDate", "manufacturer", "model", "fuelType", "pricePerDay", "fromDate",
    "toDate"],
})
@Scopes({
  full: {
    include: [() => LeasingDemand, () => RentingDemand]
  },
})

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

  @HasOne(() => LeasingDemand)
  rentee: LeasingDemand;


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
