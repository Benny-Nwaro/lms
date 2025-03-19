import { lusitana } from '@/app/ui/fonts';
import flexisaf from '@/public/flexisaf-removebg-preview.png'
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image src={flexisaf} className="h-20 w-20" alt='flexisaf logo' priority/>
      <p className="text-[30px]">flexisAf</p>
    </div>
  );
}
