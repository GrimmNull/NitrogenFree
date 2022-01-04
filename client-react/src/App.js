import './App.css';
import {AppContextProvider} from './context/provider/AppContextProvider'
import {Homepage} from './components/Homepage'

function App() {
  return (
    <AppContextProvider>
      <Homepage/>
    </AppContextProvider>
  );
}

export default App;
