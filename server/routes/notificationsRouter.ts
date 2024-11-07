import express from 'express'
import fetchAllNotifications from '../controllers/notifications/FetchAllNotifications';
import createNewNotification from '../controllers/notifications/NewNotification';
import fetchNotificationsById from '../controllers/notifications/FetchNotificationsById';

const notificationsRouter = express.Router();

notificationsRouter.get('/all',fetchAllNotifications);
notificationsRouter.post('/new',createNewNotification);
notificationsRouter.get('/findOne/:id',fetchNotificationsById);

export default notificationsRouter;