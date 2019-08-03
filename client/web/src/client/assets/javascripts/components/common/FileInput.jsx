import "./fileinput.scss";

import React from "react";
import cns from "classnames";
import Input from "components/common/Input";
import Button from "components/common/Button";

export default class FileInput extends React.PureComponent {
    render() {
        const { name, className, onChange } = this.props;
        const classes = cns(this.props.className, "file_upload_button");
        return (
            <label className={classes}>
                {this.props.children ? (
                    this.props.children
                ) : (
                    <Button isPrimaryBordered={true}>Browse & Upload</Button>
                )}
                <input
                    type="file"
                    name="req_file"
                    onChange={this.handleUpload}
                />
            </label>
        );
    }

    handleUpload = e => {
        console.log(e.target.value);
        const file = e.nativeEvent.target.files[0];
        this.props.onChange(this.props.name, file);

        /*var reader = new FileReader();

        reader.onload = (e) => {
        }
        console.log(file);
        reader.readAsDataURL(file);*/
    };
}
