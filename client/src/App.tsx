import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss';
import { Header } from './header';
import { Home } from './home';
import { About } from './about';
import { ScrollUpButton } from './scrollUpButton';
import { PageNotFound } from './pageNotFound';
import { Login } from './login';
import { ScrollToTop } from './scrollToTop';
import { Collection } from './collection';
import { Settings } from './settings';
import { AuthProvider } from './authProvider';
import { Profile } from './profile';
import { ProtectedRoute } from './protectedRoute';
interface IApplicationProps { }

const App: React.FunctionComponent<IApplicationProps> = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" >
              <Route index element={<Home />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" >
              <Route index element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path='settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/collection/:categoryParam?/:eraParam?" >
              <Route index element={<Collection />} />
              <Route path='settings' element={<Settings />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />

          </Routes>
        </AuthProvider>
        <ScrollUpButton />


      </BrowserRouter>
    </div>
  );
}

export default App;
