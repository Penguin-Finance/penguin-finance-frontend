const images = [
  { id: '1', kingSrc: 'penguin_nurse_no_crown', normalSrc: 'penguin_nurse_no_crown' },
  { id: '2', kingSrc: 'penguin_doctor_crown', normalSrc: 'penguin_doctor_no_crown' },
  { id: '3', kingSrc: 'penguin_surgeon_crown', normalSrc: 'penguin_surgeon_no_crown' },
  { id: '4', kingSrc: 'penguin_vaccine_crown', normalSrc: 'penguin_vaccine_no_crown' },
]

const colors = [
  { name: 'pink', code: 'FF81D2' },
  { name: 'red', code: 'E74242' },
  { name: 'blue', code: '3B44FF' },
  { name: 'yellow', code: 'FFF301' },
  { name: 'green', code: '53F453' },
  { name: 'turquoise', code: '08DED4' },
  { name: 'purple', code: '6C3C9A' },
  { name: 'orange', code: 'FF970D' },
  { name: 'white', code: 'FFFEE7' },
  { name: 'black', code: '2D2D2D' },
]

const getPenguinColor = (emperor) => {
  if (!emperor.color) return colors[0].code

  const penguinColor = colors.find((row) => row.name.toLowerCase() === emperor.color.toLowerCase())
  if (penguinColor) return penguinColor.code

  return emperor.code
}

const getKingPenguin = (emperor) => {
  const emperorPenguin = images.find((row) => String(row.id) === String(emperor.style))
  if (emperorPenguin) return emperorPenguin.kingSrc
  if (emperor.style) return images[0].kingSrc
  return ''
}

const getNormalPenguin = (emperor) => {
  const emperorPenguin = images.find((row) => String(row.id) === String(emperor.style))
  if (emperorPenguin) return emperorPenguin.normalSrc
  if (emperor.style && emperor.style !== '0') return images[0].normalSrc
  return ''
}

export { getPenguinColor, getKingPenguin, getNormalPenguin }
