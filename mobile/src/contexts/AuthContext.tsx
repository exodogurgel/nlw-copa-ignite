import { createContext, ReactNode, useEffect, useState } from "react"
import * as Google from "expo-auth-session/providers/google"
import * as AuthSection from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import { api } from "../services/api"

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  name: string
  avatarUrl: string
}

interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextDataProps {
  user: UserProps
  signIn: () => Promise<void>
  isUserLoading: boolean
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSection.makeRedirectUri({ useProxy: true }),
    scopes:['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true)
      await promptAsync()

    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true)

      const tokenResponse = await api.post('/users', { access_token })
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')
      setUser(userInfoResponse.data.user)

    } catch (error) {
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])
  
  return (
    <AuthContext.Provider value={{
      isUserLoading,
      signIn,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}