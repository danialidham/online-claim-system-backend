import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/postgres';
import crypto from 'crypto';

class PasswordReset extends Model {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordReset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(32).toString('hex'),
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
      },
    },
  },
  {
    tableName: 'password_resets',
    sequelize,
  }
);

export default PasswordReset;
