// app/pro/page.js
'use client'
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ProFeaturePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Pro Feature Coming Soon!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We are excited to bring new features to our pro users. However, this feature is not yet available. Please stay tuned for updates.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
