import { useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useEffect } from 'react';
import { api } from '@/convex/_generated/api';

export function useConvexUser() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const createOrUpdateUser = useMutation(api.users.createUser);
  const convexUser = useQuery(
    api.users.getCurrentUser,
    user ? { clerkId: user.id } : 'skip',
  );

  useEffect(() => {
    if (isClerkLoaded && user) {
      // Create or update user in Convex when Clerk user is available
      createOrUpdateUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        profileImageUrl: user.imageUrl || undefined,
      }).catch(console.error);
    }
  }, [isClerkLoaded, user, createOrUpdateUser]);

  return {
    user: convexUser,
    isLoading: !isClerkLoaded || (user && !convexUser),
    clerkUser: user,
  };
}
