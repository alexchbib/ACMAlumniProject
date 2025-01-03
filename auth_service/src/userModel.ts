// userModel.ts
import { IUser } from './types';

let users: IUserWithId[] = []; // Use IUserWithId array for users
let idCounter = 0; // Counter to simulate ObjectId behavior

export interface IUserWithId extends IUser {
  _id: number; // Make _id required for the mock model
}

const User = {
  findOne: async (query: { email: string }): Promise<IUserWithId | null> => {
    return users.find(user => user.email === query.email) || null;
  },
  save: async (user: IUser): Promise<void> => {
    // Create a new user with an assigned _id
    const newUser: IUserWithId = { ...user, _id: ++idCounter };
    users.push(newUser);
  }
};

export default User;