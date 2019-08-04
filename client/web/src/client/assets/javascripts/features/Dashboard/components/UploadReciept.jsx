import styles from './uploadreciept.cssm';
import React, { Fragment } from 'react';
import { createUploadRequest } from 'utils/createRequest';
import { Modal } from 'antd';
import { PushNotification, Status } from 'containers/Notifications';

export default class UploadReciept extends React.PureComponent {
    state = {
        isModelOpen: false,
    };
    getChild = () =>
        React.Children.map(this.props.children, child =>
            React.cloneElement(child, { onClick: this.onToggleModal })
        );
    render() {
        const { entityType } = this.props;
        const { isModelOpen } = this.state;

        return (
            <div>
                {this.getChild()}
                {isModelOpen ? (
                    <Modal
                        visible
                        footer={null}
                        onCancel={this.onToggleModal}
                        className={styles.modal}
                    >
                        <input type="file" name="file" onChange={this.onUpload} />
                    </Modal>
                ) : null}
            </div>
        );
    }
    onToggleModal = e => {
        if (e) {
            e.preventDefault();
        }
        this.setState({
            isModelOpen: !this.state.isModelOpen,
        });
    };

    onUpload = e => {
        const formData = new FormData();
        console.log(e.target.files[0]);
        formData.append('file', e.target.files[0]);
        e.target.files.length &&
            createUploadRequest(`/reciept`, formData, {})
                .then(([err, resp]) => {
                    if (err) {
                        this.setState({
                            error: e,
                        });
                    } else {
                        PushNotification(
                            'Upload successful',
                            `Uploaded the catqalogue`,
                            Status.SUCCESS
                        );
                    }
                })
                .catch(e => {
                    this.setState({
                        error: e,
                    });
                    PushNotification('Merge failed', e, Status.FAILURE);
                });
    };
}
