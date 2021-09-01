import { Context } from '../context'
import { useContext } from 'react'


function LanguageChooser() {
  const { state, dispatch } = useContext(Context)

  const handleLanguageChange = (e) => {
    dispatch({ type: 'language', language: e.target.value })
  }

  return (
    <div className="language text-end">
      <select onChange={handleLanguageChange} value={state.language} className="form-select ms-auto">
        <option value="en-US">English (US)</option>
        <option value="pt-BR">Português (BR)</option>
      </select>
    </div>
  )
}

export default LanguageChooser
