import api, { initCsrf } from "@/lib/axios";
import { AuthUser } from "@/store/authStore";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  await initCsrf();                               // get CSRF cookie first
  const { data } = await api.post("/login", payload);
  return {
    message: data.message,
    user: data.data.user,
  };
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  await initCsrf();                               // get CSRF cookie first
  const { data } = await api.post("/register", payload);
  return {
    message: data.message,
    user: data.data.user,
  };
};