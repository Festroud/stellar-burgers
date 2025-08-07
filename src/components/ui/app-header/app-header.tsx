import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <Link to='/' className={styles.link}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p
              className={clsx(
                'text',
                'text_type_main-default',
                'ml-2',
                'mr-10',
                {
                  [styles.active]: isConstructorActive
                }
              )}
            >
              Конструктор
            </p>
          </Link>
          <Link to='/feed' className={styles.link}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p
              className={clsx('text', 'text_type_main-default', 'ml-2', {
                [styles.active]: isFeedActive
              })}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <Link to='/profile' className={styles.link}>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p
              className={clsx('text', 'text_type_main-default', 'ml-2', {
                [styles.active]: isProfileActive
              })}
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
