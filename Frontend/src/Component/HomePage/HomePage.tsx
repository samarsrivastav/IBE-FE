import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../../Redux/thunk/propertiesThunk';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch, RootState } from '../../Redux/store';
import SearchArea from '../SearchArea/SearchArea';
import './HomePage.scss';

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const properties = useSelector((state: RootState) => state.properties.property.getProperty);
  console.log(JSON.stringify(properties));
  const health = useSelector((state: RootState) => state.health);
  console.log(health);

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