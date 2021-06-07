import { useState, createContext, useEffect } from 'react'
import * as dayjs from "dayjs"

export const TvContext = createContext(null)

const TvProvider = ({children}) => {
  const today = dayjs().day()
  const [tab, setTab] = useState(today)
  const [selectItem, setSelectItem] = useState(false)
  const [meta, setMeta] = useState(null)
  const [selectDate, setSelectDate] = useState(dayjs().format("DD-MMMM-YYYY"))

  // useEffect(() => {
  //   setMeta = 
  // }, [])
  return(
    <TvContext.Provider value={{tab, setTab, selectItem, setSelectItem, selectDate, setSelectDate}}>
      {children}
    </TvContext.Provider>
  )
}

export default TvProvider