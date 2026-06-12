import { useAuth, useUser } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { syncUser } from "../lib/api";
import { useEffect } from "react";

// This custom hook is responsible for detecting when user is login via Clerk
// Sending that user's information to backend
// Making sure that the sync is only happens once

function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const {
    mutate: syncUserMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: syncUser,
  });

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess) {
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName,
        imageUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

  return { isSynced: isSuccess };
}

export default useUserSync;
