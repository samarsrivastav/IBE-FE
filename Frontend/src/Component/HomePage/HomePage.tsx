import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../../Redux/thunk/propertiesThunk';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch, RootState } from '../../Redux/store';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const properties = useSelector((state: RootState) => state.properties);
  const health = useSelector((state: RootState) => state.health);
  console.log(health);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchHealth());
  }, [dispatch]);
  const intl = useIntl();
  return (
    <div>
      <h1>{intl.formatMessage({id:"Properties"})}</h1>
      <ul>
        {properties.properties.map((property) => (
          <li key={property.id}>
            <h2>{property.name}</h2>
            <p>{property.address}</p>
          </li>
        ))}
      </ul>

      <h1>{intl.formatMessage({id:"Health"})}</h1>

      <p>Status: {health.health.status}</p>
      <p>Message: {JSON.stringify(health.health.details)}</p>
      <Link to='/checkout'><button>Go to checkout Page</button></Link>
    </div>
  );
};

export default HomePage;