import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addBun, addIngredient } from '../../services/slices/constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleAdd = () => {
      const constructorIngredient = {
        ...ingredient,
        id: `${ingredient._id}_${Date.now()}`
      };

      if (ingredient.type === 'bun') {
        dispatch(addBun(constructorIngredient));
      } else {
        dispatch(addIngredient(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
