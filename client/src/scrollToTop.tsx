import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

type Props = {
    /**
     * A React component.
     */
    children?: React.ReactNode;
};

export const ScrollToTop = ({ children }: Props) => {
    const location = useLocation();

    useEffect(() => {
        setTimeout(()=> window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        }), 0);

    }, [location.pathname]);

    return <>
        {children}
    </>
}