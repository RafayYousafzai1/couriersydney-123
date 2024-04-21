import React from 'react';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import Link from 'next/link';

const Header = () => {
    return (
        <div position="static" style={{ background: 'red', boxShadow: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around',margin:'0 3rem' }}>
                <p style={{ color: 'white', flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <IconButton edge="start" color="inherit" aria-label="phone" size="small" >
                        <PhoneIcon style={{ fontSize: '15px' }}/>
                    </IconButton>
                    <span style={{ marginLeft: '8px' }}>Contact with us</span>
                </p>
                <p style={{ textAlign: 'right', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <Link href="/driver-opportunities" style={{ color: 'white', textDecoration: 'none' }}>
                        <span style={{ marginRight: '8px' }}>Driver Opportunities</span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Header;
