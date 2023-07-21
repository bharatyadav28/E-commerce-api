const createTokenUser = ({ user }) => {
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  return tokenUser;
};

export default createTokenUser;
