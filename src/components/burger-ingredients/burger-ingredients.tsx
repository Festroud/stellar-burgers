import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector, useAppDispatch } from '../../services/store';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  addBunAction,
  addIngredientAction
} from '../../services/slices/constructor-slice';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const ingredientsState = useAppSelector((state) => state.ingredients);
  const { collection: ingredients } = ingredientsState;

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, isBunsVisible] = useInView({
    threshold: 0
  });

  const [mainsRef, isMainsVisible] = useInView({
    threshold: 0
  });

  const [saucesRef, isSaucesVisible] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (isBunsVisible) {
      setActiveTab('bun');
    } else if (isSaucesVisible) {
      setActiveTab('sauce');
    } else if (isMainsVisible) {
      setActiveTab('main');
    }
  }, [isBunsVisible, isMainsVisible, isSaucesVisible]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab as TTabMode);

    if (tab === 'bun') {
      bunTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'main') {
      mainTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'sauce') {
      sauceTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIngredientClick = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(addBunAction(ingredient));
    } else {
      dispatch(addIngredientAction(ingredient));
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={sauceTitleRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};
