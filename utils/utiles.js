const conversorAPesos = (monto) => {
  return new Intl.NumberFormat('es-CL', { currency: 'CLP', style: 'currency' }).format(monto);
}

module.exports = {
  conversorAPesos
}