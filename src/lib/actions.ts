"use server";
import { generateCharacter, checkCry as _checkCry } from "./server/ai";
import { loadData as _loadData, deleteCharacter as _deleteCharacter } from "./server/file";

export async function loadData(index:number){
    const data = await _loadData();
    if (index >= (data.length - 5)) generateCharacter();
    return data;
}

export async function canDelete(pass:string|null){
    if (pass==process.env.PASSWORD) return true;
    return false;
}

export async function deleteCharacter(name: string, pass:string|null){
    if (pass==process.env.PASSWORD) await _deleteCharacter(name);
}

export async function checkCry(name: string, response: string){
    return await _checkCry(name, response);
}