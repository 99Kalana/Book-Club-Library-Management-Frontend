
export type User = {
    _id?: string;
    name: string;
    email: string;
    role: 'librarian';
    createdAt?: string;
    updatedAt?: string;
};


export type UserSignupFormData = {
    name: string;
    email: string;
    password?: string;
};


export type UserLoginFormData = {
    name: string;
    password?: string;
};



export type ChangePasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};