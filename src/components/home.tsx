"use client";

import Image from "next/image";
import { Suspense, useCallback, useState } from "react";
import { checkCry, loadData } from "@/lib/actions";
import Delete from "./delete";

export function Home({data}:{data:Character[]}) {
  const [cdata, setCdata] = useState<Character[]>(data);
  const [index, setIndex] = useState<number>(0);
  const [crying, setCrying] = useState<boolean>(false);

  const navigate = useCallback((newIndex: number) => {
    setIndex(newIndex);
    setCrying(false);
    loadData(index).then(
      data => setCdata(data)
    )
  }, [index]);

  const handleFormData = useCallback((formData: FormData) => {
    const response = formData.get("response");
    if (!response){
      return;
    }
    checkCry(cdata[index]?.name, response.toString()).then(setCrying);
  }, [cdata, index]);

  return <main className="h-screen w-screen flex items-center justify-center">
    <div className="flex flex-col items-center absolute px-6">
      <Suspense fallback={<></>}>
        <Delete name={cdata[index]?.name} />
      </Suspense>
      <h1 className="text-3xl font-semibold">Make {cdata[index]?.name} cry</h1>
      <p>{cdata[index]?.introduction}</p>
      <div className="flex">
        <button onClick={() => navigate((index - 1 + cdata.length) % cdata.length)}>
          <Image src="left.svg" alt="Left" width={50} height={50} className="p-2 rounded-xl hover:bg-gray-50 w-10"/>
        </button>
        {
          crying ? 
          <Image src={`/image/${cdata[index]?.name}-crying.png`} alt={`Crying`}  width={500} height={500} className="w-72 md:w-96"/> : 
          <Image src={`/image/${cdata[index]?.name}.png`} alt={`Fine`} width={500} height={500} className="w-72 md:w-96"/>
        }
        <button onClick={() => navigate((index + 1) % cdata.length)}>
          <Image src="right.svg" alt="Right" width={50} height={50} className="p-2 rounded-xl hover:bg-gray-50 w-10"/>
        </button>
      </div>
      <form className="flex justify-center w-full gap-2" action={handleFormData}>
        <input type="text" name="response" className="px-2 w-[60%] border-2 border-black rounded-xl"/>
        <button>
          <Image src="send.svg" alt="Send" width={50} height={50} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"/>
        </button>
      </form>
    </div>
  </main>
}
