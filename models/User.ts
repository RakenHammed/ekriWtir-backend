import { AllowNull, Column, CreatedAt, DeletedAt, Is, IsLowercase, Model, Table, Unique, UpdatedAt, Default, DataType, DefaultScope, Scopes } from "sequelize-typescript";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const tunisianMobilePhoneRegex = /^[2459][0-9]{7}$/;

@DefaultScope({
    attributes: ["id", "email", "firstName", "lastName", "phoneNumber", "birthDate", "nationalId",
        "accountAddress", "isSimpleUser", "isRenter", "isRentee", "isAdministrator"],
})
@Scopes({
    auth: {
        attributes: ["id", "email", "accountAddress", "accountPrivateKey", "password", "firstName", "lastName", "phoneNumber",
            "birthDate", "nationalId", "isRenter", "isRentee", "isAdministrator"],
    }
})

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

    @AllowNull(false)
    @Column
    public accountPrivateKey: string;

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

    @Default(true)
    @Column
    public isSimpleUser: boolean;

    @Column
    public isRenter: boolean;

    @Column
    public isRentee: boolean;

    @Column
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
