import React from 'react';
import NavBanner from './NavBanner';
import NavActions from './actions/NavActions';
import NavList from './NavList';

const Header: React.FC = () => {
  return (
    <header>
      <NavBanner />
      <NavActions />
      <NavList />
    </header>
  );
};

export default Header;
