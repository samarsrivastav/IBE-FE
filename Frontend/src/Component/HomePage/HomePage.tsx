import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProperties } from '../../Redux/thunk/propertiesThunk';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch } from '../../Redux/store';
import SearchArea from '../SearchArea/SearchArea';
import './HomePage.scss';

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchHealth());
  }, [dispatch]);
  return (
    <div  className='home-page-container'>
      <SearchArea />
    </div>
  );
};

export default HomePage;