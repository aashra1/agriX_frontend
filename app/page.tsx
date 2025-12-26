
'use client';

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from 'next';


const SPLASH_DURATION_MS = 1500; 

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('agrix_token');
    
    const nextRoute = token ? '/auth/dashboard' : '/login';

    const timer = setTimeout(() => {
      router.push(nextRoute);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F5FFED' }}>
      <main className="flex flex-col items-center justify-center p-8">
        
        <Image
          src="/images/logo-2.png" 
          alt="Agrix Logo"
          width={150} 
          height={150}
          priority
          className="animate-pulse"
        />
        <h1 className="mt-4 text-4xl font-bold font-crimsonPro text-[#0B3D0B]">
          AGRIX
        </h1>
      </main>
    </div>
  );
}