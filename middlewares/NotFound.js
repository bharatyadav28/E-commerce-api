const NotFoundMiddleware = (req, res) => {
  res.status(404).json({ msg: "Route doesnot exist." });
};

export default NotFoundMiddleware;
