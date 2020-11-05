import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import React, { Children } from 'react';

const ActiveLink = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';
  console.log(props)
  const className =
    asPath === props.href  ||
    props.activeMenu === 'home/explores' || props.activeMenu.includes('home/explores') ||
    props.activeMenu === 'home/live-event' ||
    props.activeMenu === 'home/exclusive' || props.activeMenu.includes('home/exclusive') ||
    (props.href === '/news' && asPath.includes(props.href))
    ? `${childClassName} ${activeClassName}`.trim()
    : childClassName;
    // console.log({...props})
    return (
      <Link href={props.href}>
      {React.cloneElement(child, {
        className: className || null,
      })}
      </Link>
    );
};

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
  activeMenu: PropTypes.string,
};

export default ActiveLink;
