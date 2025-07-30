import React from "react";
import {getExampleCaretaker} from "@/app/components/caretaker/mock";
import CareTakerCard from "@/app/components/caretaker/caretaker-card";

// Mock data for caretaker list
const caretaker = getExampleCaretaker();

export default async function CareTakerPage({params}: {params: Promise<{locale: string}>}) {
  // TODO: Translate page

  const {locale} = await params;

  return (
    // <Drawer>
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Interested Caretaker</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {caretaker.map((caretaker) => (
          <CareTakerCard caretaker={caretaker} locale={locale} key={caretaker.userId} id={caretaker.userId} />
        ))}
      </div>
    </div>
    // </Drawer>
  );
}
