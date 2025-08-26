"use client";
import { canDelete, deleteCharacter } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Delete({name}:{name:string}){
    const params = useSearchParams();
    const [show, setShow] = useState(false);
    useEffect(() => {
        canDelete(params.get("pass")).then(setShow);
    }, [params]);
    if (!show){
        return <></>
    }
    return (
        <button className="bg-red-300 p-1 rounded-lg text-white absolute top-0 right-0" onClick={
          () => deleteCharacter(name, params.get("pass"))
        }>
            Delete
        </button>
    );
}