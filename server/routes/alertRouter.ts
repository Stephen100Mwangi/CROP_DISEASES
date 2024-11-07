import express from 'express'
import fetchAllAlerts from '../controllers/alerts/FetchAllAlerts';
import createNewAlert from '../controllers/alerts/CreateNewAlert';
import fetchAlertsById from '../controllers/alerts/FetchAlertById';
import fetchAlertsByLocation from '../controllers/alerts/FetchAlertsByLocation';

const alertRouter = express.Router();

alertRouter.get('/all',fetchAllAlerts);
alertRouter.post('/new',createNewAlert)
alertRouter.get('/fetchAll/:id',fetchAlertsById);
alertRouter.get('/fetchLocation',fetchAlertsByLocation);

export default alertRouter;