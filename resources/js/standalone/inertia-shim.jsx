import React, { createContext, useContext, useState, useEffect } from 'react';

export const InertiaContext = createContext({
  url: typeof window !== 'undefined' ? window.location.pathname : '/',
  navigate: () => {},
});

export function InertiaProvider({ children }) {
  const [url, setUrl] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const onPop = () => {
      setUrl(window.location.pathname);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (href) => {
    if (!href) return;
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('//')
    ) {
      window.location.href = href;
      return;
    }

    if (href.startsWith('#')) {
      window.location.hash = href;
      return;
    }

    window.history.pushState({}, '', href);
    setUrl(href);
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <InertiaContext.Provider value={{ url, navigate }}>
      {children}
    </InertiaContext.Provider>
  );
}

export function usePage() {
  const ctx = useContext(InertiaContext);
  const currentUrl = ctx?.url || (typeof window !== 'undefined' ? window.location.pathname : '/');
  return {
    url: currentUrl,
    component: '',
    props: {},
  };
}

export function Link({ href, children, className, onClick, ...rest }) {
  const ctx = useContext(InertiaContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    if (
      !rest.target &&
      href &&
      !href.startsWith('http://') &&
      !href.startsWith('https://') &&
      !href.startsWith('//') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('#')
    ) {
      e.preventDefault();
      if (ctx?.navigate) {
        ctx.navigate(href);
      } else {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('pushstate'));
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}

export const router = {
  visit: (href) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('pushstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
};

export function Head({ title, children }) {
  useEffect(() => {
    if (title) document.title = `${title} — Harry Kusumo Negoro`;
  }, [title]);
  return <>{children}</>;
}

export default {
  Link,
  usePage,
  router,
  Head,
  InertiaProvider,
};

