export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt?: Date;
  lastLogin?: Date;
}
