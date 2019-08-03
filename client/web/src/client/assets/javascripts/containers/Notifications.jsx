import "./notifications.scss";

import keymirror from "utils/keymirror";
import React from "react";
import { connect } from "utils/connect";
import notification from "antd/lib/notification";

import * as NotificationEntity from "entities/NotificationEntity";

function getNotifications(props) {
	return {
		filters: {}
	};
}

@connect("noty", NotificationEntity, getNotifications)
export default class Notifications extends React.PureComponent {
	state = {
		lastNotyPosition: 0
	};

	componentWillReceiveProps(nextProps) {
		const newNotificationsList = nextProps.noty.value;
		if (
			newNotificationsList &&
			newNotificationsList.size !== this.state.lastNotyPosition
		) {
			const latestNoties = newNotificationsList.slice(
				this.state.lastNotyPosition
			);
			let args;
			latestNoties.forEach(latestNoty => {
				args = null;
				if (latestNoty && latestNoty.get("success")) {
					args = {
						message: "Success",
						description: latestNoty.get("description"),
						duration: 2
					};
					notification["success"](args);
				} else if (latestNoty && !latestNoty.get("success")) {
					args = {
						message: "FAILURE",
						description: latestNoty.get("message"),
						duration: 2
					};
					notification["error"](args);
				}
			});

			this.setState({ lastNotyPosition: newNotificationsList.size });
		}
	}

	render() {
		return (
			<div
				className="notifications_section"
				style={{ display: "none" }}
			/>
		);
	}
}

export const Status = {
	SUCCESS: "success",
	FAILURE: "error"
};

export const PushNotification = (message, description, status) => {
	const args = {
		message,
		description,
		duration: 5
	};
	notification[status](args);
};

export const Noty = {
    success: (message, description) => {
        PushNotification(message,description, Status.SUCCESS);
    },
    error: (message, description) => {
        PushNotification(message,description, Status.FAILURE);
    }
}
