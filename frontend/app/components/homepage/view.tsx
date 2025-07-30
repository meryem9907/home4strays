import Card from '../homepage/card';
import { useTranslations } from 'next-intl';
import SearchBox from './searchbox';
import { Link } from '@/i18n/routing';


export default function HomePage() {

  const t = useTranslations("HomePage");
  
  return (
    <div className="flex flex-col max-h-full"> 
      <div className="relative">
        <div className="absolute h-[50vh] md:h-[75vh] inset-0 bg-[url('/bghomepage.png')] bg-no-repeat bg-center bg-cover opacity-60 z-0" />
        <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
          <SearchBox />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-10 mx-auto -mt-10 pb-10 md:my-20">
        <Link href="/animals" className="flex-1"> 
          <Card title={t("all animals")} image_url="/homepage/animals.png"/> 
        </Link>
        <Link href="/ngos" className="flex-1"> 
          <Card title={t("all NGOs")} image_url="/homepage/ngos.png"/>
        </Link>
        <Link href="/aboutus" className="flex-1"> 
          <Card title={t("about")} image_url="/homepage/tha-logo.png"/>
        </Link>
      </div>
    </div>
  );
}
