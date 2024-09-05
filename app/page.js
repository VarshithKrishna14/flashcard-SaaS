import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flashcard</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="fixed" sx={{ backgroundColor: "#1f1f1f", width: "100%", borderBottom: "2px solid #444" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#e0e0e0" }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in">Login</Button>
            <Button color="inherit" href="sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212', color: '#e0e0e0', pt: 10 }}>
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          <Box sx={{ textAlign: "center", my: 9 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Welcome to Flashcard SaaS
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              The easiest way to make flashcards from your text
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }}>
              Get Started
            </Button>
          </Box>

          <Box sx={{ my: 6, textAlign: "center" }}>
            <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
              Features
            </Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                  <Typography>Simply input your text and let our software do the rest.</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
                  <Typography>Access your flashcards from any device, at any time.</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ border: "2px solid #444", borderRadius: 2, padding: 3, bgcolor: '#1e1e1e' }}>
                  <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
                  <Typography>Our AI intelligently breaks down your text into concise flashcards, perfect for studying.</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ my: 6, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>Pricing</Typography>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  border: "2px solid #444",
                  borderRadius: 2,
                  bgcolor: '#1e1e1e'
                }}>
                  <Typography variant="h6" gutterBottom>Basic</Typography>
                  <Typography variant="h5" gutterBottom>Free</Typography>
                  <Typography gutterBottom>Access to basic flashcard features and limited storage.</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }} href="/generate">Choose Basic</Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  border: "2px solid #444",
                  borderRadius: 2,
                  bgcolor: '#1e1e1e'
                }}>
                  <Typography variant="h6" gutterBottom>Pro</Typography>
                  <Typography variant="h5" gutterBottom>$10 / month</Typography>
                  <Typography gutterBottom>Access to unlimited flashcard features and storage.</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: '#ff6f61', '&:hover': { backgroundColor: '#ff3b2a' } }} href="/pro">Choose Pro</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <Box sx={{ bgcolor: '#121212', color: '#e0e0e0', p: 3, textAlign: 'center' }}>
          <Typography variant="body2">© 2024 Varshith Krishna. All rights reserved.</Typography>
        </Box>
      </Box>
    </>
  );
}
