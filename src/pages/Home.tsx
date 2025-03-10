import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Features />
    </Layout>
  );
};

export default Home;
