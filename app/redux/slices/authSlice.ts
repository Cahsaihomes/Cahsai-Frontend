import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileInfo {
  id: number;
  userId: number;
  location?: string | null;
  bio?: string | null;
  identity_verification?: string[] | null;
  isIdentityVerified: boolean;
  cnicUrl?: string | null;
  passportUrl?: string | null;
  brokerageName?: string | null;
  mlsLicenseNumber?: string | null;
  mlsAssociation?: string | null;
  linkedinUrl?: string | null;
  instagramUsername?: string | null;
  areasServed?: string[] | null;
  specializations?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentDetails {
  id: number;
  userId: number;
  cardHolderName?: string;
  cardNumber?: string;
  cardCvv?: string;
  cardExpiryDate?: string;
  cardBrand?: string;
  billingAddress?: string | null;
  account_name?: string;
  account_type?: string;
  bank_name?: string;
  iban?: string;
  routing_number?: string | null;
  currency?: string;
  email?: string;
  phone_number?: string;
  verification_documents?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  role: "buyer" | "agent" | "creator" | "admin";
  email: string;
  contact: string;
  emailVerified?: boolean;
  performancePoints?: number;
  acceptedTerms?: boolean;
  avatarUrl?: string | null;
  isDeleted: boolean;
  profile_info?: ProfileInfo | null;
  paymentDetails?: PaymentDetails | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    signupSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, logout, signupSuccess, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
