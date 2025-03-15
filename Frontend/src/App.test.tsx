import { describe, it } from 'vitest';
import { screen } from '@testing-library/react'
import { Provider } from 'react-redux';
import App from './App'
import { store } from './Redux/store';

describe('App', () => {
  it('renders the App component', () => {
    <Provider store={store}>
    render(<App />)
    </Provider>
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})