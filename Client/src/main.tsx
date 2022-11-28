import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App'
import Welcome from './components/welcome';
import Game from './components/game';
import Learning from './components/learning';
import Login from './components/login';
import Profile from './components/profile';
import About from './components/about';
import BubbleLesson from './components/sortingLessons/bubble-lesson';
import { Provider } from "react-redux";
import InsertionLesson from './components/sortingLessons/insertion-lesson';
import {store} from './features/store'
import SelectionLesson from './components/sortingLessons/selection-lesson';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '/callback',
        element: <Welcome />,
      },
      {
        path: '/game',
        element: <Game />,
      },
      {
        path: '/learning',
        element: <Learning />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/learning/bubbleLesson',
        element: <BubbleLesson />,
      },
      {path:'/insertionLesson', 
      element: <InsertionLesson/>
      },
      {path:'/selectionLesson',
    element: <SelectionLesson/>}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store = {store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
