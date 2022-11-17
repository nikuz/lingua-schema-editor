import React from 'react';
import JSONEditor, {
    JSONEditorMode,
    EditableNode,
    JSONPath,
} from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './JsonEditor.css';

export type { JSONPath };

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
            onSelect,
        } = this.props;

        if (this.containerEl) {
            this.editor = new JSONEditor(this.containerEl, {
                mode,
                onEvent: (node: EditableNode, event: Event) => {
                    if (event.type === 'mousedown' && onSelect) {
                        onSelect(node.path);
                    }
                },
            }, data);
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
