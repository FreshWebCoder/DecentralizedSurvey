import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { RouterState } from 'connected-react-router';

// Components
import Identicon from '@src/views/components/Identicon';

// Assets
import logo from '@src/img/logo.svg';

const AntDHeader = Layout.Header;
const Item = Menu.Item;

interface HeaderProps extends RouterState {
  account: string;
}

class Header extends React.Component<HeaderProps, {}> {
  render() {
    const { account, location } = this.props;

    return (
      <AntDHeader>
        <Link to={'/'}>
          <div className="logo">
            <img alt={'Logo'} src={logo} /> DecentralizedSurvey
          </div>
        </Link>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: '64px' }}
        >
          <Item key={'/account'} disabled>
            {account.substring(0, 4)}
            ... <Identicon address={account} size={30} />
          </Item>
          <Item key={'/create'}>
            <Link to={'/create'}>Create</Link>
          </Item>
          <Item key={'/dashboard'}>
            <Link to={'/dashboard'}>Dashboard</Link>
          </Item>
        </Menu>
      </AntDHeader>
    );
  }
}

export default Header;
