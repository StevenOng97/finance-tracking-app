import Guide from "@/components/home/Guide";
import Hero from "@/components/home/Hero";
import PreviewImage from "@/components/home/PreviewImage";

async function page() {
  return (
    <div className="flex flex-col">
      <main className="flex justify-center">
        <div className="items-center flex flex-col gap-10 justify-end mx-auto p-10 w-full sm:py-20 sm:w-[1000px]">
          <Hero />
          <PreviewImage />
          <Guide />
        </div>
      </main>
    </div>
  );
}

export default page;
