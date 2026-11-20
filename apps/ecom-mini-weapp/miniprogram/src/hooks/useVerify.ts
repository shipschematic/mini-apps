import { useSelector } from 'react-redux'
import { RootState } from '../store'

export function useVerify(): boolean {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  return isLoggedIn
}

export function useUserInfo() {
  const user = useSelector((state: RootState) => state.user)
  return {
    userInfo: user,
    isLoggedIn: user.isLoggedIn,
    userId: user.id,
  }
}
