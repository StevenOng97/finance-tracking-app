import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

type IStepComponentProps = {
  stepCount: number;
  title: string;
  desc: string;
  img: string;
};
const StepComponent = ({
  stepCount,
  title,
  desc,
  img,
}: IStepComponentProps) => {
  return (
    <div className="text-left">
      <Separator />
      <p className="font-bold pt-2">Step {stepCount}</p>
      <div className="relative h-[300px] border-2 border-white rounded-md my-4">
        <Image src={img} alt="demo image" fill />
      </div>
      <p className="font-bold text-xl py-2">{title}</p>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
};

const guideSteps = [
  {
    id: 1,
    title: "Sign up for an account",
    desc: "It's only take a few clicks to get started.",
    img: "/images/step1.png",
  },
  {
    id: 2,
    title: "Manage your currency",
    desc: "Set your default currency for transactions",
    img: "/images/step2.png",
  },
  {
    id: 3,
    title: "Add Expense, Income",
    desc: "Add your expenses and income to track your finance easily",
    img: "/images/step3.png",
  },
];

const Guide = () => {
  return (
    <section className="text-center">
      <h2 className="text-5xl font-bold pb-5">
        Start your financing tracking in minutes
      </h2>
      <p className="text-sm w-[500px] m-auto text-muted-foreground">
        Follow these simple steps to get started with your finance tracking
      </p>
      <div className="grid grid-cols-3 gap-10 pt-20">
        {guideSteps.map((step) => {
          return (
            <StepComponent
              key={step.id}
              stepCount={step.id}
              title={step.title}
              desc={step.desc}
              img={step.img}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Guide;
