import {ToastContainer, Toast} from "react-bootstrap";
import {useStore} from "~/store";

export const Notifications = () => {
  const [notifications, removeNotification] = useStore(state => [
    state.notifications,
    state.removeNotification
  ]);

  return (
    <ToastContainer position="bottom-end">
      {notifications.map(notification => (
        <Toast
          animation
          autohide
          onClose={() => removeNotification(notification.id)}
          key={notification.id}
          bg={notification.variant}
        >
          <Toast.Header>{notification.title}</Toast.Header>

          <Toast.Body>{notification.body}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};
