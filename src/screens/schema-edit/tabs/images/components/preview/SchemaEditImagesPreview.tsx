import React from 'react';
import { Box } from '@mui/material';

interface Props {
    images: string[],
}

export default function SchemaEditImages(props: Props) {
    const { images } = props;

    return (
        <Box sx={{ mt: 4 }}>
            {images.map((item, key) => {
                return (
                    <div className="image" key={key}>
                        <img
                            src={`${item}`}
                            alt=""
                            loading="lazy"
                        />
                    </div>
                );
            })}
        </Box>
    );
}
