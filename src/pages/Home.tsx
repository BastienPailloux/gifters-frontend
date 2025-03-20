import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import { SEO } from '../components/common/seo';

const Home: React.FC = () => {
  return (
    <Layout>
      <SEO translationKey="seo.home" />
      <Hero />
      <Features />
    </Layout>
  );
};

export default Home;
