import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../../Redux/thunk/propertiesThunk';
import { fetchHealth } from '../../Redux/thunk/healthThunk';
import { AppDispatch, RootState } from '../../Redux/store';

// interface Health {
//   status: string;
//   details: {
//     message: string;
//   };
// }

const HomePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const properties = useSelector((state: RootState) => state.properties);
  const health = useSelector((state: RootState) => state.health);
  console.log(health);
  // const message = JSON.parse(JSON.stringify(health.health.details));

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchHealth());
  }, [dispatch]);

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.properties.map((property) => (
          <li key={property.id}>
            <h2>{property.name}</h2>
            <p>{property.address}</p>
          </li>
        ))}
      </ul>

      <h1>Health</h1>

      <p>Status: {health.health.status}</p>
      <p>Message: {JSON.stringify(health.health.details)}</p>
      {/* <p>{health.health.details.message == undefined}</p> */}
    </div>
  );
};

export default HomePage;