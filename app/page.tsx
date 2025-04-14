import Hero from "@/components/home/hero";
import { Header } from "@/components/shared/header";

const page = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
    </main>
  );
};

export default page;
