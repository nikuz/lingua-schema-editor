import React from 'react';
import { FormTree } from '../../../components';
import schema from './schema';

export default function Definitions() {
    return (
        <div className="form-row">
            <FormTree
                fields={schema}
                intent={0}
                dividerText="Definitions"
            />
        </div>
    );
}
