import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-5xl">🔍</div>
      <h1 className="text-xl font-semibold text-slate-800">
        No encontramos esta página
      </h1>
      <Link href="/" className="btn-primary">
        Ir al tablero
      </Link>
    </main>
  );
}
