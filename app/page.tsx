import Hero from "@/components/home/hero";
import Featured_properties from "@/components/home/featured-properties";

const page = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Featured_properties />
    </main>
  );
};

export default page;
