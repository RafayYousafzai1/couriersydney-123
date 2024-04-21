"use client"

import React, { useEffect, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import PdfButton from '../PdfButton';
import { Divider } from '@mantine/core';

const CourierSummary = ({
    courierDetails: {
        userName,
        docId,
        LxWxH,
        payment,
        service,
        pieces,
        userEmail,
        weight,
        totalPrice,
    },
    pdf
}) => {
    const buttonRef = useRef(null);

    // Use useEffect to trigger button click after everything is loaded
    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, [pdf]);
    return (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px auto', width: '30rem', borderRadius: '1rem' }}>
            <Typography mt={2} variant="h5" bgcolor={"#f04a02"} color={"#fff"} p={1} borderRadius={2} gutterBottom>
                {`Here's the summary of ${userName}'s courier`}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Tracking Number:</span> {docId || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Email:</span> {userEmail || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Dimensions:</span> {LxWxH || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Payment Method:</span> {payment || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Service Type:</span> {service || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Pieces:</span> {pieces || "loading"}
            </Typography>
            <Typography mt={2} variant="body1">
                <span style={{ fontWeight: '700' }}>Weight:</span> {weight || "loading"}
            </Typography>
            <Typography bgcolor={"black"} p={1} color={"#fff"} borderRadius={2} mt={2} variant="body1">
                <span style={{ fontWeight: '700', width: '8rem' }}>Total Price:</span> {totalPrice || "loading"}$
            </Typography>
            <br />
            <Divider />
            <p style={{ fontWeight: '800' }}>Download PDF</p>
            <PdfButton
                ref={buttonRef} // Assign the ref to the button
                invoice={pdf}
                s={pdf?.service || "N/A"}
                d={pdf?.date || "N/A"}
            />
        </Paper>
    );
};

export default CourierSummary;
