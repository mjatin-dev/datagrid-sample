import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import createRootReducer from "./reducers";
import sagas from "./sagas";
import createMigrate from "redux-persist/es/createMigrate";
export const history = createBrowserHistory();
const migrations = {
  0: (state) => state,
  3: (previousVersionState) => ({
    number: {
      change: previousVersionState.number,
      lastUpdate: new Date(),
    },
  }),
};

const persistConfig = {
  key: "root",
  storage,
  version: 3,
  whitelist: [
    "complianceOfficer",
    "teamMemberFlow",
    "auth",
    "users",
    "adminMenu",
    "HistoryReducer",
    "PaymentReducer",
    "NewRegulationsQuizReducer",
    "AuditReducer",
    "DashboardState",
    "CompanyExistsState",
    "otherCompliance",
    "auditCommonUtilsReducer",
    "eventsModuleReducer",
  ],
  migrate: createMigrate(migrations, { debug: true }),
};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState) {
  const sagaMiddleware = createSagaMiddleware();
  const rootReducer = createRootReducer(history);
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer, // root reducer with router state
    preloadedState,

    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
  );
  sagaMiddleware.run(sagas);
  const persistor = persistStore(store);
  return {
    store,
    persistor,
  };
}
