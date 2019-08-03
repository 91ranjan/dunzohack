import './login.scss';

import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import Input from 'components/common/Input';
import Button from 'components/common/Button';
import Navlink from 'components/common/Navlink';

import { connectDummy } from 'utils/connectDummy';
import * as AuthEntity from 'entities/AuthEntity';

import PageHeader from 'components/PageHeader';

@connectDummy('auth', AuthEntity)
class ForgotPasswordForm extends React.PureComponent {
    static contextTypes = {
        history: PropTypes.object,
    };

    state = {
        formData: Map()
    };

    render() {
        const { formData } = this.state;

        return (
            <form className="login_form" onSubmit={this.onLogin}>
                <Input
                    placeholder="Old Password"
                    name="old_password"
                    hasBorder={true}
                    size="large"
                    className="auth_input"
                    onChange={this.onChange}
                    value={formData.old_password}
                />
                <Input
                    placeholder="New Password"
                    name="new_password1"
                    hasBorder={true}
                    size="large"
                    className="auth_input"
                    onChange={this.onChange}
                    value={formData.new_password1}
                />
                <Input
                    placeholder="Confirm Password"
                    name="confirm_password"
                    hasBorder={true}
                    size="large"
                    className="auth_input"
                    onChange={this.onChange}
                    value={formData.confirm_password}
                />
                <div className="form_actions">
                    <Button htmlType={'submit'} isLarge={true} isYellow={true} isFullWidth={true}>
                        Reset Password
                    </Button>
                </div>
                <Button className="link" onClick={this.onBack}>
                    Back
                </Button>
            </form>
        );
    }

    onChange = (name, value) => {
        this.setState({ formData: formData.set(name, value) });
    };

    onBack = () => {
        window.history.back();
    }

    onLogin = e => {
        e.preventDefault();
        this.props.auth.onLogin({
            filters: this.state,
        });
    };
}

export default class ForgotPassword extends React.PureComponent {
    render() {
        return (
            <div className="login_form">
                <span className="auth_heading">
                    <b>Change Password</b>
                </span>
                <span className="auth_meta">
                    Please eneter the email address registered on your account
                </span>
                <br />
                <br />
                <ForgotPasswordForm />
            </div>
        );
    }
}
