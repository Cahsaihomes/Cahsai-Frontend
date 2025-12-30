
import {
  multipartPrivateAxios,
  multipartPublicAxios,
  publicAxios,
  publicAxiosWithToken,
  privateAxios,
} from "./axiosInstance";
import Cookies from "js-cookie";
interface SignUpPayload {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  role: "buyer" | "agent" | "creator";
  contact: string;
  password: string;
  acceptedTerms: boolean | string;
}

interface LoginPayload {
  email: string;
  password: string;
}
interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface UserPaymentPayload {
  userId: number;
  brokerageName: string;
  mlsLicenseNumber: string;
  mlsAssociation: string;
  cardHolderName: string;
  cardNumber: string;
  cardBrand: string;
  cardExpiryDate: string;
  billingAddress: string;
}
export interface FollowUnfollowResponse {
  status: string;
  message?: string;
  data?: any;
}
export const signup = async (data: SignUpPayload) => {
  const response = await publicAxios.post("/users/register", data);
  return response.data;
};

export const loginApi = async (data: LoginPayload) => {
  const response = await publicAxios.post("/users/login", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await publicAxios.post(
    "/users/forgot-password/request-otp",
    { email }
  );
  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await publicAxios.post("/users/verify-otp", { email, otp });
  return response.data;
};

export const forgotPasswordOtpVerify = async (email: string, otp: string) => {
  const response = await publicAxios.post("/users/forget-password/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

export const resetPassword = async ({
  email,
  newPassword,
}: ResetPasswordPayload) => {
  const response = await publicAxios.post(
    "/users/forget-password/reset-password",
    { email, newPassword }
  );
  return response.data;
};

export const logoutApi = async () => {
  const response = await privateAxios.post("/users/logout");
  return response.data;
};

export const agentPymentDetails = async ({
  userId,
  brokerageName,
  mlsLicenseNumber,
  mlsAssociation,
  cardHolderName,
  cardNumber,
  cardBrand,
  cardExpiryDate,
  billingAddress,
}: UserPaymentPayload) => {
  const response = await publicAxios.post("/users/payment-details", {
    userId,
    brokerageName,
    mlsLicenseNumber,
    mlsAssociation,
    cardHolderName,
    cardNumber,
    cardBrand,
    cardExpiryDate,
    billingAddress,
  });
  return response.data;
};

export const agentCreateProfile = async (formdata: FormData) => {
  const response = await multipartPublicAxios.put(
    "/users/create-agent",
    formdata
  );
  return response.data;
};

export const changePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await publicAxiosWithToken.put("/users/updatePassword", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const editProfileService = async (formdata: FormData) => {
  const response = await multipartPrivateAxios.put(
    "/users/updateProfile",
    formdata
  );
  return response.data;
};


export const followUnfollowUser = async (userId: string | number) => {
  const response = await multipartPrivateAxios.post(`/users/${userId}/follow`);
  return response.data;
};