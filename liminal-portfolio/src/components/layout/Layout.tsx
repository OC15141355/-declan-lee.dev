import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
`;

const Layout = ({ 
  children, 
  title = 'Liminal Portfolio', 
  description = 'A minimalist developer portfolio' 
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>{children}</Main>
    </>
  );
};

export default Layout;
