import { SearchBar } from './components/SearchBar';
import { ResultsList } from './components/ResultsList';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar />
      <ResultsList />
    </div>
  );
}
