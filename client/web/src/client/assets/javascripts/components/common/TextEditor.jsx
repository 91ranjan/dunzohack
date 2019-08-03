import styles from './texteditor.cssm';
import 'react-quill/dist/quill.snow.css';

import React from 'react';
import ReactQuill from 'react-quill';

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
];

export default class TextEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    render() {
        const { label } = this.props;
        const { editorState } = this.state;
        return (
            <label className={styles.texteditor}>
                {label ? <span>{label}</span> : ''}
                <ReactQuill
                    theme="snow"
                    value={this.state.text}
                    onChange={this.onChange}
                    modules={modules}
                    formats={formats}
                />
            </label>
        );
    }

    onChange = value => {
        this.setState({
            text: value,
        });
    };
}
