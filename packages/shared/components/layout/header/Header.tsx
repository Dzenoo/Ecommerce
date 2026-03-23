import NavBanner from './NavBanner';
import NavActions from './actions/NavActions';
import NavList from './list/NavList';

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
