export default (req, res) => {
  const data = {
    message: 'Hello from the server!',
  };

  res.status(200).json(data);
};