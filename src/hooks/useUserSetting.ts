import { useContext } from 'react'
import { SettingContext } from 'contexts/SettingContext'

const useUserSetting = () => {
  const { isMusic, toggleMusic, visibleBlock, toggleVisibleBlock } = useContext(SettingContext)
  return { isMusic, toggleMusic, visibleBlock, toggleVisibleBlock }
};

export default useUserSetting
