import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  ForgotPassword,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from './protected-route';
import { OrderModal } from '../custom-modals/orderModal';
import { IngredientModal } from '../custom-modals/ingredientModal';

export const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route path='/profile'>
          <Route index element={<ProtectedRoute element={<Profile />} />} />
          <Route
            path='orders'
            element={<ProtectedRoute element={<ProfileOrders />} />}
          />
          <Route
            path='orders/:number'
            element={<ProtectedRoute element={<OrderInfo />} />}
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <IngredientModal onClose={() => navigate(-1)}>
                <IngredientDetails />
              </IngredientModal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <OrderModal onClose={() => navigate(-1)}>
                <OrderInfo />
              </OrderModal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <OrderModal onClose={() => navigate(-1)}>
                <OrderInfo />
              </OrderModal>
            }
          />
        </Routes>
      )}
    </>
  );
};
