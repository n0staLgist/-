import { Route, Switch } from 'wouter';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GamePage } from './pages/GamePage';

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  return (
    <Switch>
      <Route path="/" component={GamePage} />
      <Route path="/game" component={GamePage} />
      <Route path="/about" component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
