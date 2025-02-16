import { supabase } from './supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export type AuthError = {
  message: string;
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : 'Une erreur est survenue lors de la connexion'
      }
    };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { 
      data: null, 
      error: {
        message: error.message.includes('already exists')
          ? 'Cette adresse email est déjà utilisée. Veuillez vous connecter.'
          : 'Une erreur est survenue lors de l\'inscription'
      }
    };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: makeRedirectUri({
          path: 'auth/callback',
        }),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: 'Une erreur est survenue lors de la connexion avec Google'
      }
    };
  }
};

export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: makeRedirectUri({
          path: 'auth/callback',
        }),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: 'Une erreur est survenue lors de la connexion avec Apple'
      }
    };
  }
};

export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: makeRedirectUri({
          path: 'auth/callback',
        }),
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: {
        message: 'Une erreur est survenue lors de la connexion avec Facebook'
      }
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { 
      error: {
        message: 'Une erreur est survenue lors de la déconnexion'
      }
    };
  }
};