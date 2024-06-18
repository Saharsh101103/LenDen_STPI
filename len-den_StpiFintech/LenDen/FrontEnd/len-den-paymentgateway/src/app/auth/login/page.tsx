"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SigninForm } from '@/components/SignInForm';
import Image from 'next/image';

export default function SignIn()  {




  return (
    <section className='bg-[url("/authbg.png")] bg-cover bg-center py-2 flex justify-center items-center min-h-screen '>
    <div className='max-w-7xl space-y-4'>
    <div className=''>
    <Image src={'/logonew.png'} alt={''} width={800} height={800}/>
    </div>
    <div className='text-2xl font-bold text-secondary flex flex-col justify-center items-center'>
    <p>Sign-in to लेन-Den</p>
     <SigninForm/>
    </div>
    </div>
    <div className='w-full max-w-4xl'>

    </div>
    </section>
  );
};

