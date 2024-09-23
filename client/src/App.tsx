import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss';
import { Header } from './header';
import { Home } from './home';
import { About } from './about';
import { ScrollUpButton } from './scrollUpButton';
import { PageNotFound } from './pageNotFound';
import { MiniGame } from './miniGame';
import { ScrollToTop } from './scrollToTop';
import { Collection } from './collection';
import { Settings } from './settings';

interface IApplicationProps { }

const App: React.FunctionComponent<IApplicationProps> = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" >
            <Route index element={<Home />} />
          </Route>
          {/*<Route path="/minigame" element={<MiniGame />} />*/}
          <Route path="/about" element={<About />} />
          <Route path="/collection/:categoryParam?/:eraParam?" >
            <Route index element={<Collection />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />

        </Routes>
        <ScrollUpButton />
      </BrowserRouter>
    </div>
  );
}

export default App;
