import ReactDOM from 'react-dom';
import React from 'react';
import Goods from './Goods';
import GoodItem from './GoodItem';
import Page404 from './Page404';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getAllGoods, getOneGood, getCategories } from './api';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import CreateType from './CreateType';
import Types from './Types';
import Navigation from './Navigation';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Navigation />,
      errorElement: <Page404 />,
      children: [
        {
          path: "register",
          element: <RegisterForm />
        },
        {
          path: "login",
          element: <LoginForm />
        },
        {
          path: "goods/create",
          element: <CreateForm />
        },
        {
          path: "goods/:goodId/edit",
          element: <EditForm />
        },
        {
          path: "goods/category/:ctId?",
          element: <Goods />
        },
        {
          path: "goods",
          element: <Goods />,
          loader: getAllGoods,
          children: [
            {
              path: ":goodId",
              element: <GoodItem />,
              loader: ({ params }) => { return getOneGood(params.goodId) }
            }
          ]
        },
        {
          path: "/categories/create",
          element: <CreateType />
        },
        {
          path: "/categories/",
          element: <Types />,
          loader: getCategories
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={routes} />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
