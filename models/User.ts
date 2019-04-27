import { AllowNull, Column, CreatedAt, DeletedAt, Is, IsLowercase, Model, Table, Unique, UpdatedAt, Default, DataType } from "sequelize-typescript";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const tunisianMobilePhoneRegex = /^[2459][0-9]{7}$/;

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
    public birthdate: Date;

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
