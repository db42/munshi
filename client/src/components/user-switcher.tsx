import React from 'react';
import { useUser } from '../context/UserContext';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users } from 'lucide-react';

export const UserSwitcher = () => {
  const { users, currentUser, setCurrentUser } = useUser();

  const handleUserChange = (user: typeof currentUser) => {
    if (user.id !== currentUser.id) {
      setCurrentUser(user);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          <span>{currentUser.first_name} {currentUser.last_name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {users.map(user => (
          <DropdownMenuItem key={user.id} onClick={() => handleUserChange(user)}>
            {user.first_name} {user.last_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 