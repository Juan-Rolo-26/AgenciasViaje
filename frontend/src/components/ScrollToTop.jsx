import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Si hay un hash (como #quejas), scroll a ese elemento
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    const offset = 80; // Altura del header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            // Si no hay hash, scroll arriba
            window.scrollTo({
                top: 0,
                behavior: 'instant' // Instantáneo para cambios de página
            });
        }
    }, [pathname, hash]);

    return null;
}
