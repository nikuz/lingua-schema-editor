import React from 'react';

interface SchemaRendererContextType {
    onDataPathSelect?: (schemaPath: string, dataPath: string) => void,
}

const SchemaRendererContext = React.createContext<SchemaRendererContextType>({});

export default SchemaRendererContext;