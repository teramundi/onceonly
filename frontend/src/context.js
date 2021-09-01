import { createContext, useReducer } from 'react'
import { i18n } from './i18n'

const initialState = {
  language: i18n.language
}

function reducer(state, action) {
  switch (action.type) {
    case 'language':
      i18n.changeLanguage(action.language)
      return { ...state, language: action.language }
    default:
      throw new Error('Unknown action.type: ' + action.type);
  }
}

const Context = createContext()

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

export { Context, ContextProvider }
