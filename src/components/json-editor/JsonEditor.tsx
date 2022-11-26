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
    onSelect?: (path: string) => void,
}

export default class JsonEditor extends React.Component<Props> {
    containerEl: HTMLDivElement | null = null;

    editor?: JSONEditor;

    componentDidMount() {
        this.createEditor();
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.data !== this.props.data) {
            console.log('asdasd');
            this.editor?.update(this.props.data);
            this.editor?.collapseAll();
        }
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
                enableSort: false,
                onEvent: this.eventHandler,
            }, data);
        }
    };

    eventHandler = (node: EditableNode, event: Event) => {
        const { onSelect } = this.props;

        if (event.type === 'mousedown' && onSelect) {
            onSelect(this.getJMESPath(node.path));
        }
    };

    getJMESPath = (path: JSONPath): string => {
        let JMESPath = '';
        for (let i = 0, l = path.length; i < l; i++) {
            const part = path[i];
            if (typeof part === 'string') {
                JMESPath += `${i !== 0 ? '.' : ''}${part}`;
            } else {
                JMESPath += `[${part}]`;
            }
        }

        return JMESPath;
    }

    render() {
        return (
            <div
                ref={el => this.containerEl = el}
                className="json-editor-container"
            />
        );
    }
}
