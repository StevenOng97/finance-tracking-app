import Image from "next/image";

const PreviewImage = () => {
  return (
    <section className="w-full shadow-custom">
      <Image
        src="/images/step3.png"
        alt="Preview"
        width={1000}
        height={600}
      />
    </section>
  );
};

export default PreviewImage;
