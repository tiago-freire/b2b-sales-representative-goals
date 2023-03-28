export function convertStringCurrencyToNumber(valorString: string) {
  let valorNumericoString = valorString.replace(/[^\d.,]/g, '')

  valorNumericoString = valorNumericoString.replace(/[,.](?=\d{3})/g, '')
  valorNumericoString = valorNumericoString.replace(',', '.')
  const valorNumerico = parseFloat(valorNumericoString)

  return valorNumerico
}
