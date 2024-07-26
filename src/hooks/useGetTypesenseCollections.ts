import { useTypesense } from '@/providers/typesenseProvider';
import { useState, useEffect } from 'react'
import { CollectionSchema } from "typesense/lib/Typesense/Collection";

const useGetTypesenseCollections = () => {
  const typesense = useTypesense();

  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [data, setData] = useState<CollectionSchema[] | undefined>(undefined);

  const fetchCollections = async () => {
    typesense?.client?.collections().retrieve().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!typesense?.client || loading) {
      return;
    }

    setLoading(true);
    setIsInitialLoading(false);

    fetchCollections();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typesense])

  const refetch = () => {
    setLoading(true);

    fetchCollections();
  };

  return {
    data,
    isLoading: loading || isInitialLoading,
    refetch: refetch
  }
}

export default useGetTypesenseCollections;