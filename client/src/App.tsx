import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss';
import { Header } from './header';
import { Home } from './home';
import { About } from './about';
import { Terms } from './terms';
import { ScrollUpButton } from './scrollUpButton';
import { PageNotFound } from './pageNotFound';
import { Login } from './login';
import { ScrollToTop } from './scrollToTop';
import { Collection } from './collection';
import { Settings } from './settings';
import { AuthProvider } from './authProvider';
import { Profile } from './profile';
import { Sets } from './sets';
import { ProtectedRoute } from './protectedRoute';
import Footer from './footer';
import { CardDetails } from './cardDetails';
import { UrlProvider } from './urlProvider';
interface IApplicationProps { }

const App: React.FunctionComponent<IApplicationProps> = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop >
          <UrlProvider>
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
                <Route path="/sets" element={<Sets />} />
                <Route path="/collection/:categoryParam/:codeParam" >
                  <Route index element={<Collection />} />
                  <Route path='settings' element={<Settings />} />
                  <Route path=':cardID' element={<CardDetails />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </AuthProvider>
          </UrlProvider>
          <ScrollUpButton />
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

export default App;
