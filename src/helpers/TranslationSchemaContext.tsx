import React from 'react';

interface TranslationSchemaContextType {
    onDataPathSelect?: (schemaPath: string, dataPath: string) => void,
}

const TranslationSchemaContext = React.createContext<TranslationSchemaContextType>({});

export default TranslationSchemaContext;