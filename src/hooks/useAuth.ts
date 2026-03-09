import { useCallback, useEffect, useState } from "react";
import { AuthError, Factor, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  mfaRequired: boolean;
}

interface MFAFactors {
  totp: Factor[];
  phone: Factor[];
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    mfaRequired: false,
  });
  const [factors, setFactors] = useState<MFAFactors>({ totp: [], phone: [] });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          mfaRequired: false,
        }));

        // Defer MFA factor fetch with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchMFAFactors();
          }, 0);
        }
      },
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
      if (session?.user) {
        fetchMFAFactors();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!error && data) {
        setFactors({
          totp: data.totp || [],
          phone: data.phone || [],
        });
      }
    } catch (err) {
      console.error("Error fetching MFA factors:", err);
    }
  };

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      return { data, error };
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Check if MFA is required
    if (data?.session?.user && !error) {
      const { data: assuranceData } = await supabase.auth.mfa
        .getAuthenticatorAssuranceLevel();
      if (
        assuranceData?.nextLevel === "aal2" &&
        assuranceData?.currentLevel === "aal1"
      ) {
        setState((prev) => ({ ...prev, mfaRequired: true }));
      }
    }

    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const verifyMFA = useCallback(async (factorId: string, code: string) => {
    const { data: challengeData, error: challengeError } = await supabase.auth
      .mfa.challenge({ factorId });

    if (challengeError) {
      return { error: challengeError };
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (!error) {
      setState((prev) => ({ ...prev, mfaRequired: false }));
    }

    return { data, error };
  }, []);

  const enrollTOTP = useCallback(async (friendlyName?: string) => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: friendlyName || "Authenticator App",
    });

    return { data, error };
  }, []);

  const verifyTOTPEnrollment = useCallback(
    async (factorId: string, code: string) => {
      const { data: challengeData, error: challengeError } = await supabase.auth
        .mfa.challenge({ factorId });

      if (challengeError) {
        return { error: challengeError };
      }

      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (!error) {
        await fetchMFAFactors();
      }

      return { data, error };
    },
    [],
  );

  const unenrollMFA = useCallback(async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (!error) {
      await fetchMFAFactors();
    }

    return { error };
  }, []);

  return {
    ...state,
    factors,
    signUp,
    signIn,
    signOut,
    verifyMFA,
    enrollTOTP,
    verifyTOTPEnrollment,
    unenrollMFA,
    refreshFactors: fetchMFAFactors,
  };
}
