import path from 'path';
import { readFile } from 'fs/promises';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const fn = (await params).name;
    if (!/^[a-zA-Z0-9._ -]+$/.test(fn)) {
    return new Response('Invalid file name', { status: 400 });
  }
  const baseDir = path.join(process.cwd(), 'uploads', 'images');
  const filePath = path.join(baseDir, fn);
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(baseDir)) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const data = await readFile(path.join(process.cwd(), 'uploads', 'images', fn));
    return new Response(new Uint8Array(data), { headers: { 'Content-Type': 'image/png' } });
  } catch (e: any) {
    return new Response('Not found', { status: 404 });
  }
}
