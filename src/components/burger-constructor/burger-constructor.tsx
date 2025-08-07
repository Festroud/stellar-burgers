import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  orderBurger,
  clearOrder
} from '../../services/slices/constructor-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const constructorState = useAppSelector((state) => state.burgerConstructor);
  const userState = useAppSelector((state) => state.user);

  const { constructorItems, orderRequest, orderModalData } = constructorState;
  const { isAuthenticated } = userState;

  const handleOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientsForOrder = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];

    dispatch(orderBurger(ingredientsForOrder));
  };

  const handleCloseModal = () => {
    dispatch(clearOrder());
  };

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
