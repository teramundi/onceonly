import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Header from './components/Header'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Home from './pages/Home'
import ViewSecret from './pages/ViewSecret'
import Faq from './pages/Faq'
import Logs from './pages/Logs'
import { ContextProvider } from './context'

function App() {
  return (
    <ContextProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path={["/", "/done"]}>
            <Home />
          </Route>
          <Route exact path="/faq">
            <Faq />
          </Route>
          <Route exact path="/logs">
            <Logs />
          </Route>
          <Route path="/:key">
            <ViewSecret />
          </Route>
        </Switch>
        <Menu />
        <Footer />
      </Router>
    </ContextProvider>
  );
}

export default App;
