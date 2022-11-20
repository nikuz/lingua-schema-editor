import React from 'react';
import JSONEditor, {
    JSONEditorMode,
    EditableNode,
    JSONPath,
} from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './JsonEditor.css';

interface Props {
    data?: any,
    mode?: JSONEditorMode,
    onChange?: (value: string) => void,
    onSelect?: (path: JSONPath) => void,
}

export default class JsonEditor extends React.Component<Props> {
    containerEl: HTMLDivElement | null = null;

    editor?: JSONEditor;

    componentDidMount() {
        this.createEditor();
    }

    componentWillUnmount() {
        if (this.editor) {
            this.editor.destroy();
        }
    }

    createEditor = () => {
        const {
            mode,
            data,
        } = this.props;

        if (this.containerEl) {
            this.editor = new JSONEditor(this.containerEl, {
                mode,
                onEvent: this.eventHandler,
            }, data);
        }
    };

    eventHandler = (node: EditableNode, event: Event) => {
        const { onSelect } = this.props;

        if (event.type === 'mousedown' && onSelect) {
            onSelect(node.path);
        }
    };

    render() {
        return (
            <div
                ref={el => this.containerEl = el}
                className="json-editor-container"
            />
        );
    }
}
