"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Hero = () => {
  const { user } = useUser();

  return (
    <section className="text-center flex gap-6 flex-col">
      <h1 className="text-7xl font-bold">
        Control your{" "}
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text font-bold leading-tight tracking-tighter text-transparent">
          Finance
        </span>{" "}
        easier
      </h1>
      <h3 className="text-sm text-muted-foreground">
        Track your expenses, manage your income, and get insights on your money
      </h3>
      {user ? (
        <Link href={"/dashboard"}>
          <Button className="mt-4 px-14 w-fit m-auto">Go to Dashboard</Button>
        </Link>
      ) : (
        <Link href={"/sign-in"}>
          <Button className="mt-4 px-14 w-fit m-auto">Get started</Button>
        </Link>
      )}
    </section>
  );
};

export default Hero;
