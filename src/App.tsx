import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from '@/shared/ui';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
