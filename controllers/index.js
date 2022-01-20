const WebpayPlus = require("transbank-sdk").WebpayPlus;
const { conversorAPesos } = require("../utils/utiles");
const GLOBALS = require('../utils/globals');
const Pagos = require('../database/logic');
const nodemailer = require('../utils/nodemailder');
function main(req, res) {
  res.render("index");
}

function formulario(req, res, next) {
  let url = req.protocol + "://" + req.get("host") + "/confirmacion";
  const { monto, title } = req.body;
  const montoEnPesos = conversorAPesos(monto);

  const data = {
    title,
    url,
    montoEnPesos,
    monto
  }

  res.render("formulario_pagos", { data });
}

async function confirmarDatos(req, res) {
  const { curso,
    email_apoderado,
    nombre_alumno,
    nombre_apoderado,
    rut_alumno,
    monto } = req.body;
  const pago = {
    curso,
    nombre_alumno,
    nombre_apoderado,
    rut_alumno,
    email_apoderado,
    monto,
    token: 'No aplica',
    estado: GLOBALS.ESTADO_PENDIENTE,
    fecha: Date.now()
  }
  let res_pago = await Pagos.createOne(pago);
  let returnUrl = req.protocol + "://" + req.get("host") + "/guardar";
  const buyOrder = res_pago.id;
  const sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
  const createResponse = await WebpayPlus.Transaction.create(
    buyOrder,
    sessionId,
    monto,
    returnUrl
  );
  let token = createResponse.token;
  let url = createResponse.url;
  const montoEnPesos = conversorAPesos(monto);
  let data = {
    email_apoderado,
    nombre_alumno,
    nombre_apoderado,
    rut_alumno,
    montoEnPesos,
    curso,
    url,
    token
  }
  res.render("confirmacion_datos", { data });
}

async function postPago(req, res) {
  let token = req.body.token_ws;
  let commitResponse = "";
  if (token) {
    commitResponse = await WebpayPlus.Transaction.commit(token);

    let pago = await Pagos.findOneForID(commitResponse.buy_order);
    pago.token = token;
    pago.estado = GLOBALS.ESTADO_APROBADO;
    await pago.save();
    let viewData = pago.dataValues;
    viewData.monto = conversorAPesos(viewData.monto);
    await nodemailer.sendPaidMail(viewData.email_apoderado, viewData);
    await nodemailer.sendNewPay(viewData);
    res.render('compra_aceptada', { viewData });
    return
  }
  else {
    try {
      token = req.body.TBK_TOKEN;
      commitResponse = await WebpayPlus.Transaction.commit(token);
    }
    catch (e) {
      let orden_compra = req.body.TBK_ORDEN_COMPRA;
      let pago = await Pagos.findOneForID(orden_compra);
      pago.estado = GLOBALS.ESTADO_CANCELADO;
      await pago.save();
      res.render('compra_cancelada', { orden_compra });
      return
    }
  }
}

module.exports = {
  main,
  formulario,
  postPago,
  confirmarDatos
}