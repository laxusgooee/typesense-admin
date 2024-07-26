import { TypesenseProvider } from '@/providers/typesenseProvider';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TypesenseProvider>
        <main className="relative min-h-screen flex flex-col bg-white dark:bg-slate-900">
            {children}
        </main>
    </TypesenseProvider>
  )
}