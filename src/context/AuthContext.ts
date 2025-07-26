
import { createContext } from "react";
import type {User} from "../types/User"; 

export interface AuthContextType {
    isLoggedIn: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
    isAuthenticating: boolean;
    user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


