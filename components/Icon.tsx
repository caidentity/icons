'use client';

import React from 'react';
import styles from '../styles/Icon.module.scss';

interface IconProps {
    name: string;
    onClick: () => void;
}

const Icon = ({ name, onClick }: IconProps) => {
    return (
        <div className={styles.icon} onClick={onClick}>
            <i className={`icon-${name}`}></i>
        </div>
    );
};

export default Icon; 