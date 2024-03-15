import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { DataGraph } from "../service/api";

interface DataInterface {
  date: string;
  values:{
    coca: number;
    monster: number;
    agua: number;
    suco: number;
    redbull: number;
    fanta: number
  } 
}

interface ProviderInterface {
  dataApi: DataInterface[],
  setDataApi: Dispatch<SetStateAction<[]>>
}

interface DataProps {
  children: ReactNode
}

const GraphContext = createContext<ProviderInterface>({} as ProviderInterface)

export function GraphProvider({children}: DataProps) {

  const [dataApi, setDataApi] = useState<[]>([]);

  async function results() {
    const all = await DataGraph.getAllItems();
    setDataApi(all.data)
  }

  const value: ProviderInterface = {
    dataApi: dataApi,
    setDataApi: setDataApi,
  }

  useEffect(() => {
    if(dataApi && Object.keys(dataApi).length === 0){
      results()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataProvider() {
  const context = useContext(GraphContext);
  if(!context) {
    throw new Error('Erro provider')
  }
  return context;
}