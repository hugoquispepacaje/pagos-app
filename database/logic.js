const Pago = require('./model');

const createOne = async (data) => {
  let response = await Pago.create(data);
  return response;
}

const findOneForID = async (id) => {
  let response = await Pago.findByPk(id);
  return response;
}

const updateOne = async (id, data) => {
  let response = await Pago.update(
    data,
    {
      where: {
        id
      }
    }
  );
  return response;
}

module.exports = {
  createOne,
  findOneForID,
  updateOne
}