import { badWordsFilter } from 'utils/address'

const penguinImages = [
  { id: '1', kingSrc: 'penguin_top_hat', normalSrc: 'penguin_top_hat_no_crown', name: 'Top hat' },
  { id: '2', kingSrc: 'penguin_fedora', normalSrc: 'penguin_fedora_no_crown', name: 'Fedora' },
  { id: '3', kingSrc: 'penguin_eye_patch_with_crown', normalSrc: 'penguin_eye_patch_no_crown', name: 'Eye patch' },
  { id: '4', kingSrc: 'penguin_sunglass_with_crown', normalSrc: 'penguin_sunglass_no_crown', name: 'Sunglass' },
  { id: '5', kingSrc: 'penguin_suit', normalSrc: 'penguin_suit_no_crown', name: 'Suit' },
  { id: '6', kingSrc: 'penguin_senpai', normalSrc: 'penguin_senpai_no_crown', name: 'Senpai' },
  { id: '7', kingSrc: 'penguin_chef', normalSrc: 'penguin_chef_no_crown', name: 'Chef' },
  { id: '8', kingSrc: 'penguin_scarf_with_crown', normalSrc: 'penguin_scarf_no_crown', name: 'Scarf' },
  { id: '9', kingSrc: 'penguin_sombrero', normalSrc: 'penguin_sombrero_no_crown', name: 'Sombrero' },
  { id: '10', kingSrc: 'penguin_sasquatch', normalSrc: 'penguin_sasquatch_no_crown', name: 'Sasquatch' },
  { id: '11', kingSrc: 'penguin_lydian_with_crown', normalSrc: 'penguin_lydian_no_crown', name: 'Lydian' },
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

  return emperor.color.charAt(0) === '#' ? emperor.color.slice(1) : emperor.color
}

const getKingPenguin = (emperor) => {
  const emperorPenguin = penguinImages.find((row) => String(row.id) === String(emperor.style))
  if (emperorPenguin) return emperorPenguin.kingSrc
  if (Number(emperor.style) > 0) return penguinImages[0].kingSrc
  return ''
}

const getNormalPenguin = (emperor) => {
  const emperorPenguin = penguinImages.find((row) => String(row.id) === String(emperor.style))
  if (emperorPenguin) return emperorPenguin.normalSrc
  if (emperor.style && emperor.style !== '0') return penguinImages[0].normalSrc
  return ''
}

const getStealCrownTooltip = (poisonedBy, timeLeftForPoison) => {
  return `You were poisoned by ${badWordsFilter(
    poisonedBy,
  )}, you must wait ${timeLeftForPoison} seconds before attempting to steal the crown.`
}

export { getPenguinColor, getKingPenguin, getNormalPenguin, penguinImages, getStealCrownTooltip }
