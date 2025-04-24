import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProperties } from '../../Redux/thunk/propertiesThunk';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch } from '../../Redux/store';
import SearchArea from '../SearchArea/SearchArea';
import './HomePage.scss';
import useAnalytics from '../../Hooks/useAnalytics';

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const analytics = useAnalytics();

  useEffect(() => {
    // Track component load with more details
    analytics.logEvent('HomePage', 'ComponentLoaded', 'HomePage component mounted');
    
    // Track API calls
    dispatch(fetchProperties());
    dispatch(fetchHealth());
  }, [dispatch, analytics]);

  return (
    <div className='home-page-container'>
      <SearchArea />
    </div>
  );
};

export default HomePage;