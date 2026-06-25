// Esse hook realiza requests a partir da pagina 1, a primeira pagina (0) deve ser feita pelo seu componente
// Esse hook deve ser chamado pela prop ListboxProps do Autocompleto MUI
// Ex: ListboxProps={{onScroll: hasMore ? handleScroll : null}}

import { useState, useCallback, useEffect } from 'react';

const usePaginatedOptions = (baseUrl, fetchFunction = async () => {}) => {
    const [options, setOptions] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        //Pegando apenas o termo na URL
        const match = baseUrl.match(/=(.*)$/)
        if(match?.[1] !== '') {
            setPage(0)
            setHasMore(true)
            setOptions([])
        }
    
        return () => {
            setPage(0)
        }
    }, [baseUrl])   
  
    const loadMoreResults = useCallback(async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      try {
        const nextPage = page + 1;
        const fullUrl = `${baseUrl}&pagina=${nextPage}`;
        const newItems = await fetchFunction(fullUrl);
  
        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setOptions((prevOptions) => [...prevOptions, ...newItems]);
          setPage(nextPage);
        }
      } catch (error) {
        console.error('Erro ao carregar mais resultados:', error);
      } finally {
        setLoading(false);
      }
    }, [baseUrl, fetchFunction, page, hasMore, loading]);
  
    const handleScroll = useCallback((event) => {
      const listboxNode = event.currentTarget;
      const position = listboxNode.scrollTop + listboxNode.clientHeight;
  
      if ((listboxNode.scrollHeight - Math.floor(position) <= 16) && hasMore && !loading) {
        loadMoreResults();
      }
    }, [loadMoreResults, hasMore, loading]);
  
    return {
      options,
      handleScroll,
      loadMoreResults,
      loading,
      hasMore,
    };
  };

export default usePaginatedOptions;
