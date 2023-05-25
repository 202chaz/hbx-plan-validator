import './App.css';
import Uploader from './Uploader';


function App() {
  return (
    <div className="App">
      <nav className="navbar mb-4" style={{backgroundColor: '#007bc4'}}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{color: '#fff', fontSize: '30px'}}>Plan Validator</a>
        </div>
      </nav>
      <div className="container-fluid">
        <Uploader />
      </div>
    </div>
  );
}

export default App;
