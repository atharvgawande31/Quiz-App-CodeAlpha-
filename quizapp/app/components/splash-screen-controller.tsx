import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabse';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync(); // prevent auto hide until we decide

export default function SplashScreenController() {
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          // user logged in → go home
          router.replace('/');
        } else {
          // user not logged in → go to login
          router.replace('/auth/login');
        }
      } catch (e) {
        console.error('Splash Error:', e);
        router.replace('/auth/login');
      } finally {
        await SplashScreen.hideAsync(); // ✅ must call this
      }
    };

    init();
  }, []);

  return null;
}