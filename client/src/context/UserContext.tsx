import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a user object
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

// Hardcoded list of users for local development
const hardcodedUsers: User[] = [
  { id: 123, email: 'dushyant37@gmail.com', first_name: 'dushyant', last_name: 'bansal' },
  { id: 456, email: 'vinodbansal1957@gmail.com', first_name: 'vinod kumar', last_name: 'bansal' },
];

// Define the shape of the context state
interface UserContextType {
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

// Create the context with a default undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>(hardcodedUsers);
  
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const storedUser = users.find(u => u.id === parseInt(storedUserId, 10));
      if (storedUser) {
        return storedUser;
      }
    }
    // Default to the first user if nothing is stored or user not found
    return users[0];
  });

  const setCurrentUser = (user: User) => {
    if (user.id !== currentUser.id) {
      localStorage.setItem('currentUserId', String(user.id));
      window.location.reload();
    }
  };

  const value = { users, currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 