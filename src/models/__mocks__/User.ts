const User = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  prototype: {
    validPassword: jest.fn(),
  },
};

export default User;
