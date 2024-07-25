'use client'
 
import Typesense from "typesense";
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTypesense } from '@/providers/typesenseProvider';
import { useBearStore } from '@/store/user';
 
export function AuthenticatedLayout({ children }: { readonly children : React.ReactNode }) {
  const router = useRouter();
  const typesense = useTypesense();
  const { apiKey } = useBearStore();

  const [loading, setLoading] = useState(true);

  const checkClient = useCallback(async () => {
    const res = await typesense?.client?.health.retrieve();

    if (res?.ok) {
        return setLoading(false);
    }

    const client = new Typesense.Client({
        'nodes': [{
            'host': 'localhost',
            'port': 8108,
            'protocol': 'http'
        }],
        'apiKey': apiKey as string,
        'connectionTimeoutSeconds': 2
    });

    typesense?.setClient(client);

    return setLoading(false);
  }, [apiKey, typesense]);

  useEffect(() => {
    setLoading(true);
    if (!apiKey) {
        router.push("/login");

        return setLoading(false);
    }

    checkClient();
    
  }, [apiKey, router, checkClient]);
 
  return (
    <div>
        {loading && <p>Loading...</p>}
        {children}
    </div>
  )
}