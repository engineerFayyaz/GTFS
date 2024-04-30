import Routes from "./Routes";
import AOSInitializer from "./AOSInitializer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div>
      <AOSInitializer>
        <Routes />
        <ToastContainer />
      </AOSInitializer>
    </div>
  );
}

export default App;
