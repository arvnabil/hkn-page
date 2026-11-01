import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// CSS Design Tokens & Tailwind
import '../../assets/theme.css';
import '../css/app.css';

// Standalone Inertia Shim & Provider
import { InertiaProvider } from './standalone/inertia-shim';

// Pages
import Home from './Pages/Home';
import About from './Pages/About';
import Solutions from './Pages/Solutions';
import Inquiry from './Pages/Inquiry';
import ArticlesIndex from './Pages/Articles/Index';
import ArticlesShow from './Pages/Articles/Show';
import ProductsIndex from './Pages/Products/Index';
import ProductsShow from './Pages/Products/Show';
import Comparison from './Pages/Comparison';
import GuidesIndex from './Pages/Guides/Index';
import GuidesShow from './Pages/Guides/Show';

// Data
import articlesData from './data/articles.json';
import productsData from './data/products.json';
import advisorData from './data/advisor.json';
import guidesData from './data/guides.json';
import solutionsData from './data/solutions.json';
import siteData from './data/site.json';

function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const renderCurrentPage = () => {
    // Normalisasi pathname
    let clean = currentPath.toLowerCase().replace(/\/$/, '') || '/';
    // Hilangkan ekstensi .html jika ada
    clean = clean.replace(/\.html$/, '');

    // Route: Beranda
    if (clean === '/' || clean === '/index' || clean === '/home') {
      return <Home articles={articlesData} products={productsData} advisor={advisorData} />;
    }

    // Route: Tentang
    if (clean === '/tentang' || clean === '/about') {
      return <About advisor={advisorData} />;
    }

    // Route: Solusi
    if (clean === '/solusi' || clean === '/solutions') {
      return <Solutions solutions={solutionsData} products={productsData} site={siteData} />;
    }

    // Route: Penawaran / Inquiry
    if (clean === '/penawaran' || clean === '/inquiry') {
      return <Inquiry site={siteData} />;
    }

    // Route: Produk
    if (clean === '/produk' || clean === '/products') {
      return <ProductsIndex products={productsData} />;
    }

    // Route: Detail Artikel (/artikel/:id atau /artikel/:slug)
    if (clean.startsWith('/artikel/')) {
      const param = clean.replace('/artikel/', '');
      const matched = articlesData.find(
        (item) => String(item.id) === param || item.slug === param
      ) || articlesData[0];

      return <ArticlesShow article={matched} advisor={advisorData} site={siteData} />;
    }

    // Route: Index Artikel
    if (clean === '/artikel' || clean === '/articles' || clean === '/article') {
      return <ArticlesIndex articles={articlesData} advisor={advisorData} site={siteData} />;
    }

    // Route: Detail Produk (/produk/:id)
    if (clean.startsWith('/produk/') && clean !== '/produk') {
      const param = clean.replace('/produk/', '');
      const matched = productsData.find((p) => p.id === param) || productsData[0];
      return <ProductsShow product={matched} products={productsData} site={siteData} />;
    }

    // Route: Perbandingan
    if (clean === '/perbandingan' || clean === '/comparison') {
      return <Comparison products={productsData} advisor={advisorData} site={siteData} />;
    }

    // Route: Detail Panduan (/panduan/:slug)
    if (clean.startsWith('/panduan/') && clean !== '/panduan') {
      const slug = clean.replace('/panduan/', '');
      const matched = guidesData.find((g) => g.slug === slug) || guidesData[0];
      return <GuidesShow guide={matched} guides={guidesData} advisor={advisorData} site={siteData} />;
    }

    // Route: Index Panduan
    if (clean === '/panduan' || clean === '/guides' || clean === '/guide') {
      return <GuidesIndex guides={guidesData} advisor={advisorData} site={siteData} />;
    }

    // Fallback: Beranda
    return <Home articles={articlesData} products={productsData} advisor={advisorData} />;
  };

  return (
    <InertiaProvider>
      {renderCurrentPage()}
    </InertiaProvider>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
