import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

function useAuthRequest() {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  // Including the token to the request headers
  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;
    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
    return () => {
      api.interceptors.request.eject(interceptor);
      isInterceptorRegistered = false;
    };
  }, [isSignedIn, getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthRequest;
