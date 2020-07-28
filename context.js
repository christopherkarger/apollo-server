const context = ({ req }) => {
  const noUser = { user: false };
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return noUser;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return noUser;
  }
  let decodedToken;
  let tokenError;
  try {
    decodedToken = jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        tokenError = true;
      }
    });
    if (tokenError) {
      return noUser;
    }
  } catch (err) {
    return noUser;
  }
  if (!decodedToken) {
    return noUser;
  }
  return {
    user: decodedToken.userId,
  };
};

module.exports = context;
