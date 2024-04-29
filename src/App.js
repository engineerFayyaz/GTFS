import Routes from "./Routes";
import AOSInitializer from "./AOSInitializer";
function App() {
  return (
    <div>
      <AOSInitializer>
        <Routes />
      </AOSInitializer>
    </div>
  );
}

export default App;
