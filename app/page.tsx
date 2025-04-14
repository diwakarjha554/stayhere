import Hero from "@/components/home/hero";
import { Header } from "@/components/shared/header";
import Featured_properties from "@/components/home/featured-properties";

const page = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Featured_properties />
    </main>
  );
};

export default page;
