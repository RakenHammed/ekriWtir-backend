import {
    AllowNull, Column, CreatedAt, DataType, Default,
    DefaultScope, DeletedAt, Is, IsLowercase, Model, Scopes,
    Table, Unique, UpdatedAt, HasMany, HasOne
} from "sequelize-typescript";
import { RentingDemand } from "./RentingDemand";
import { Car } from "./Car";
import { LeasingDemand } from "./LeasingDemand";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const tunisianMobilePhoneRegex = /^[2459][0-9]{7}$/;

@DefaultScope(() => ({
    attributes: ["id", "email", "firstName", "lastName", "phoneNumber", "birthDate", "nationalId",
        "accountAddress", "isSimpleUser", "isRenter", "isRentee", "isAdministrator"],
}))
@Scopes(() => ({
    auth: {
        attributes: ["id", "email", "accountAddress", "password", "firstName", "lastName", "phoneNumber",
            "birthDate", "nationalId", "isRenter", "isRentee", "isAdministrator"],
    }
}))

@Table
export class User extends Model<User> {
    @AllowNull(false)
    @Unique
    @Is(emailRegex)
    @IsLowercase
    @Column(DataType.STRING(126))
    public email: string;

    @AllowNull(false)
    @Column
    public password: string;

    @AllowNull(false)
    @Column
    public accountAddress: string;

    @Column
    public firstName: string;

    @Column
    public lastName: string;

    @Is(tunisianMobilePhoneRegex)
    @Column
    public phoneNumber: string;

    @Column
    public birthDate: Date;

    @Column
    public nationalId: string;

    @HasMany(() => RentingDemand, "userId")
    public renters: RentingDemand[];

    @HasOne(() => LeasingDemand, "userId")
    public rentee: LeasingDemand;

    @HasMany(() => Car, "userId")
    public cars: Car[];

    @Default(true)
    @Column(DataType.BOOLEAN)
    public isSimpleUser: boolean;

    @Column(DataType.BOOLEAN)
    public isRenter: boolean;

    @Column(DataType.BOOLEAN)
    public isRentee: boolean;

    @Column(DataType.BOOLEAN)
    public isAdministrator: boolean;

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
