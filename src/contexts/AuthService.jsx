import {api} from '../util/axiosConfig'

export const fetchAuthStatus = async () => {
  const response = await api.get(`auth/me`)
  return response.data.user
}

export const loginUser = async (email, password) => {
  const response = await api.post(`auth/login`,{ email, password })
  return response.data.user
}

export const registerUser = async (name, email, password, role) => {
  await api.post(`auth/register`,{name, email, password, role})
}

export const logoutUser = async () => {
  await api.post(`auth/logout`, {})
}
