// types.ts
export interface IUser {
    email: string;
    password: string;
  }
  
  export interface IUserWithId extends IUser {
    _id: number; // Make _id required for the mock model
  }