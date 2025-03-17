import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';

export const AppLayout = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }; 
  
    return (
      <div className="container-xxl position-relative bg-white d-flex p-0">
        {!isLoginPage &&  <Sidebar  />}
        <div className={isLoginPage ? "w-100" : "content"}>
          {!isLoginPage && <Topbar  />}
          {children}
          {!isLoginPage && <Footer />}
        </div>
        <a className="btn btn-lg btn-primary btn-lg-square back-to-top" onClick={scrollToTop}>
          <i className="bi bi-arrow-up"></i>
        </a>
      </div>
    );
  };
  